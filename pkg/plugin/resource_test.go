package plugin

import (
	"fmt"
	"sort"
	"strings"
	"testing"
	"time"

	"github.com/IoTOpen/go-lynx"
)

func TestProcessMessageJoin_basic(t *testing.T) {
	// prepare functions
	fMsg := &lynx.Function{ID: 1, InstallationID: 7, Type: "pos", Meta: map[string]string{"topic_read": "t1", "device_id": "100"}}
	fData := &lynx.Function{ID: 2, InstallationID: 7, Type: "data", Meta: map[string]string{"topic_read": "t1", "device_id": "100"}}
	fOther := &lynx.Function{ID: 3, InstallationID: 7, Type: "data", Meta: map[string]string{"topic_read": "t1"}} // missing device_id
	fn := []*lynx.Function{fMsg, fData, fOther}

	// prepare logs: first a messageFrom entry, then a data entry
	logResult := []lynx.LogEntry{
		{Timestamp: float64(time.Now().Unix()), Topic: "t1", Message: "Message1", Value: 0},
		{Timestamp: float64(time.Now().Add(time.Second).Unix()), Topic: "t1", Message: "", Value: 42},
	}

	res := processMessageJoin(fn, logResult, "device_id", "pos")
	fmt.Println("--- debug: logResult")
	for i, e := range logResult {
		fmt.Printf("%d: topic=%s ts=%.0f msg=%q val=%v\n", i, e.Topic, e.Timestamp, e.Message, e.Value)
	}
	fmt.Println("--- debug: result map")
	for id, msgs := range res {
		fmt.Printf("fn %d: %v\n", id, msgs)
	}
	t.Logf("debug res: %+v", res)

	// fData should have received Message1
	msgs, ok := res[fData.ID]
	if !ok || len(msgs) == 0 {
		t.Fatalf("expected messages for function %d, got none", fData.ID)
	}
	if msgs[0] != "Message1" {
		t.Fatalf("expected Message1 for function %d, got %q", fData.ID, msgs[0])
	}

	// fOther has no device_id and therefore should not receive the message
	if msgs2, ok2 := res[fOther.ID]; ok2 && len(msgs2) > 0 {
		t.Fatalf("expected no messages for function %d (no link), got %v", fOther.ID, msgs2)
	}
}

func TestProcessMessageJoin_multipleMessages(t *testing.T) {
	fMsg := &lynx.Function{ID: 1, InstallationID: 7, Type: "pos", Meta: map[string]string{"topic_read": "t1", "device_id": "100"}}
	fData := &lynx.Function{ID: 2, InstallationID: 7, Type: "data", Meta: map[string]string{"topic_read": "t1", "device_id": "100"}}
	fn := []*lynx.Function{fMsg, fData}

	// two messages, later one should be used
	now := time.Now()
	logResult := []lynx.LogEntry{
		{Timestamp: float64(now.Unix()), Topic: "t1", Message: "Message1", Value: 0},
		{Timestamp: float64(now.Add(time.Second).Unix()), Topic: "t1", Message: "Message2", Value: 0},
		{Timestamp: float64(now.Add(2 * time.Second).Unix()), Topic: "t1", Message: "", Value: 1},
	}

	res := processMessageJoin(fn, logResult, "device_id", "pos")
	fmt.Println("--- debug: logResult")
	for i, e := range logResult {
		fmt.Printf("%d: topic=%s ts=%.0f msg=%q val=%v\n", i, e.Topic, e.Timestamp, e.Message, e.Value)
	}
	fmt.Println("--- debug: result map")
	for id, msgs := range res {
		fmt.Printf("fn %d: %v\n", id, msgs)
	}
	t.Logf("debug res: %+v", res)
	msgs := res[fData.ID]
	if len(msgs) == 0 {
		t.Fatalf("expected messages for function %d, got none", fData.ID)
	}
	if msgs[len(msgs)-1] != "Message2" {
		t.Fatalf("expected latest Message2 as last entry, got %v", msgs)
	}
}

func TestProcessMessageJoin_outOfOrderTimestamps(t *testing.T) {
	fMsg := &lynx.Function{ID: 1, InstallationID: 7, Type: "pos", Meta: map[string]string{"topic_read": "t1", "device_id": "100"}}
	fData := &lynx.Function{ID: 2, InstallationID: 7, Type: "data", Meta: map[string]string{"topic_read": "t1", "device_id": "100"}}
	fn := []*lynx.Function{fMsg, fData}

	// message has earlier timestamp but appears after data in slice -> no mapping (current behavior)
	now := time.Now()
	logResult := []lynx.LogEntry{
		{Timestamp: float64(now.Add(time.Second).Unix()), Topic: "t1", Message: "", Value: 1},
		{Timestamp: float64(now.Unix()), Topic: "t1", Message: "Message1", Value: 0},
	}

	res := processMessageJoin(fn, logResult, "device_id", "pos")
	fmt.Println("--- debug: logResult (out-of-order)")
	for i, e := range logResult {
		fmt.Printf("%d: topic=%s ts=%.0f msg=%q val=%v\n", i, e.Topic, e.Timestamp, e.Message, e.Value)
	}
	fmt.Println("--- debug: result map")
	for id, msgs := range res {
		fmt.Printf("fn %d: %v\n", id, msgs)
	}
	t.Logf("debug res: %+v", res)
	if msgs, ok := res[fData.ID]; ok && len(msgs) > 0 {
		t.Fatalf("expected no mapping due to out-of-order processing, got %v", msgs)
	}
}

func TestProcessMessageJoin_differentInstallationsAndTopicNormalization(t *testing.T) {
	// two functions with same device_id but different installations
	f1 := &lynx.Function{ID: 1, InstallationID: 1, Type: "pos", Meta: map[string]string{"topic_read": "t1", "device_id": "100"}}
	f2 := &lynx.Function{ID: 2, InstallationID: 2, Type: "data", Meta: map[string]string{"topic_read": "t1", "device_id": "100"}}
	fn := []*lynx.Function{f1, f2}

	now := time.Now()
	// message from installation 1 only
	logResult := []lynx.LogEntry{
		{Timestamp: float64(now.Unix()), Topic: "t1", Message: "M1", Value: 0},
		{Timestamp: float64(now.Add(time.Second).Unix()), Topic: "t1", Message: "", Value: 5},
	}

	// ensure installation ID is part of composite key: only functions in same installation should get message
	res := processMessageJoin(fn, logResult, "device_id", "pos")
	fmt.Println("--- debug: logResult (different installations)")
	for i, e := range logResult {
		fmt.Printf("%d: topic=%s ts=%.0f msg=%q val=%v\n", i, e.Topic, e.Timestamp, e.Message, e.Value)
	}
	fmt.Println("--- debug: result map")
	for id, msgs := range res {
		fmt.Printf("fn %d: %v\n", id, msgs)
	}
	t.Logf("debug res: %+v", res)
	if msgs, ok := res[f2.ID]; ok && len(msgs) > 0 {
		t.Fatalf("expected no mapping for different installation, got %v", msgs)
	}

	// Topic normalization: if log has prefix, ensure it must be normalized to match mapping
	// without normalization, it will not match
	prefixedLogs := []lynx.LogEntry{
		{Timestamp: float64(now.Unix()), Topic: "pref/t1", Message: "M1", Value: 0},
		{Timestamp: float64(now.Add(time.Second).Unix()), Topic: "pref/t1", Message: "", Value: 5},
	}
	// Without stripping prefix, mapping should not occur
	res2 := processMessageJoin(fn, prefixedLogs, "device_id", "pos")
	fmt.Println("--- debug: prefixedLogs")
	for i, e := range prefixedLogs {
		fmt.Printf("%d: topic=%s ts=%.0f msg=%q val=%v\n", i, e.Topic, e.Timestamp, e.Message, e.Value)
	}
	fmt.Println("--- debug: res2")
	for id, msgs := range res2 {
		fmt.Printf("fn %d: %v\n", id, msgs)
	}
	t.Logf("debug res2: %+v", res2)
	if msgs, ok := res2[f2.ID]; ok && len(msgs) > 0 {
		t.Fatalf("expected no mapping without topic normalization, got %v", msgs)
	}
	// With normalization (strip prefix)`
	normalized := make([]lynx.LogEntry, 0, len(prefixedLogs))
	for _, e := range prefixedLogs {
		t := strings.SplitN(e.Topic, "/", 2)
		if len(t) == 2 {
			e.Topic = t[1]
		}
		normalized = append(normalized, e)
	}
	res3 := processMessageJoin(fn, normalized, "device_id", "pos")
	fmt.Println("--- debug: normalized logs")
	for i, e := range normalized {
		fmt.Printf("%d: topic=%s ts=%.0f msg=%q val=%v\n", i, e.Topic, e.Timestamp, e.Message, e.Value)
	}
	fmt.Println("--- debug: res3")
	for id, msgs := range res3 {
		fmt.Printf("fn %d: %v\n", id, msgs)
	}
	t.Logf("debug res3: %+v", res3)
	if msgs, ok := res3[f2.ID]; ok && len(msgs) > 0 {
		// still no mapping because installation mismatch, but this ensures normalization does enable matching by topic
		// check mapping for function in same installation
	}
	// add a data function in installation 1 to assert normalization effect
	fDataSameInst := &lynx.Function{ID: 3, InstallationID: 1, Type: "data", Meta: map[string]string{"topic_read": "t1", "device_id": "100"}}
	fn2 := []*lynx.Function{f1, fDataSameInst}
	res4 := processMessageJoin(fn2, normalized, "device_id", "pos")
	if msgs, ok := res4[fDataSameInst.ID]; !ok || len(msgs) == 0 || msgs[0] != "M1" {
		t.Fatalf("expected mapping after normalization for same installation, got %v", msgs)
	}
}

func TestProcessMessageJoin_realDataset(t *testing.T) {
	// dataset from user (timestamps and messages)
	raw := []struct {
		ts    float64
		topic string
		value float64
		msg   string
	}{
		{1772029902, "2272/obj/generated/f8208fc4-e081-4caf-8ab5-3a269d98b1db", 33.1337, "Geohash3"},
		{1772029901, "2272/obj/generated/f8208fc4-e081-4caf-8ab5-3a269d98b1db", 22.1337, "Geohash2"},
		{1772029900, "2272/obj/generated/f8208fc4-e081-4caf-8ab5-3a269d98b1db", 11.1337, "Geohash1"},
		{1772029587, "2272/obj/generated/f8208fc4-e081-4caf-8ab5-3a269d98b1db", 33.1337, "Geohash3"},
		{1772029586, "2272/obj/generated/f8208fc4-e081-4caf-8ab5-3a269d98b1db", 22.1337, "Geohash2"},
		{1772029585, "2272/obj/generated/f8208fc4-e081-4caf-8ab5-3a269d98b1db", 11.1337, "Geohash1"},
		{1772027272, "2272/obj/generated/f8208fc4-e081-4caf-8ab5-3a269d98b1db", 14.571557, "Geohash4"},
		{1772027262, "2272/obj/generated/f8208fc4-e081-4caf-8ab5-3a269d98b1db", 13.571557, "Geohash3"},
		{1772027261.871, "2272/obj/generated/f8208fc4-e081-4caf-8ab5-3a269d98b1db", 13.371337, "Geohash"},
	}

	// create log entries and synthetic data entries (empty msg) right after each message
	var logs []lynx.LogEntry
	for _, r := range raw {
		logs = append(logs, lynx.LogEntry{Timestamp: r.ts, Topic: r.topic, Message: r.msg, Value: r.value})
		// synthetic data entry that should receive the previous message
		logs = append(logs, lynx.LogEntry{Timestamp: r.ts + 0.5, Topic: r.topic, Message: "", Value: r.value + 0.1})
	}

	// normalize topics as fetchLog does (strip leading prefix) and sort by timestamp ascending
	for i := range logs {
		t := strings.SplitN(logs[i].Topic, "/", 2)
		if len(t) == 2 {
			logs[i].Topic = t[1]
		}
	}
	sort.Slice(logs, func(i, j int) bool { return logs[i].Timestamp < logs[j].Timestamp })

	// prepare functions: a message function (type pos) and a data function
	strippedTopic := strings.SplitN(raw[0].topic, "/", 2)[1]
	fMsg := &lynx.Function{ID: 100, InstallationID: 2269, Type: "pos", Meta: map[string]string{"topic_read": strippedTopic, "device_id": "31945"}}
	fData := &lynx.Function{ID: 101, InstallationID: 2269, Type: "data", Meta: map[string]string{"topic_read": strippedTopic, "device_id": "31945"}}
	fn := []*lynx.Function{fMsg, fData}

	res := processMessageJoin(fn, logs, "device_id", "pos")

	// debug
	t.Logf("total logs: %d", len(logs))
	for i, e := range logs {
		t.Logf("%02d: ts=%.3f topic=%s msg=%q val=%v", i, e.Timestamp, e.Topic, e.Message, e.Value)
	}
	t.Logf("result: %+v", res)

	// Expect that for each synthetic data entry the message equals the immediately preceding message
	dataMsgs, ok := res[fData.ID]
	if !ok || len(dataMsgs) == 0 {
		t.Fatalf("expected mapped messages for data function, got none")
	}
	// There should be as many dataMsgs as original raw entries
	if len(dataMsgs) != len(raw) {
		t.Fatalf("expected %d mapped messages, got %d", len(raw), len(dataMsgs))
	}
	// Build expected mapping by scanning logs in chronological order:
	// keep last seen non-empty message and for each synthetic data entry (Message=="")
	// record the current last seen message as expected
	var expected []string
	lastSeen := ""
	for _, e := range logs {
		if e.Message != "" {
			lastSeen = e.Message
		} else {
			expected = append(expected, lastSeen)
		}
	}
	if len(expected) != len(dataMsgs) {
		t.Fatalf("expected %d mapped messages, got %d", len(expected), len(dataMsgs))
	}
	for i := range expected {
		if dataMsgs[i] != expected[i] {
			t.Fatalf("mismatch at %d: expected %q got %q", i, expected[i], dataMsgs[i])
		}
	}
}
