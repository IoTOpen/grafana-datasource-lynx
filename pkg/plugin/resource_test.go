package plugin

import (
	"reflect"
	"testing"
	"time"

	"github.com/IoTOpen/go-lynx"
)

// TestProcessMessageJoin_mapping verifies that messages from a "messageFrom" type
// are joined onto other functions sharing the same link key (device_id).
func TestProcessMessageJoin_mapping(t *testing.T) {
	// create two functions sharing the same device_id but different topics/types
	geohashTopic := "f8208fc4-e081-4caf-8ab5-3a269d98b1db"
	rssiTopic := "bf24598e-78d2-4b8a-926a-35f5a528a80b"
	fnGeo := &lynx.Function{ID: 1, Type: "geohash", InstallationID: 2269, Meta: map[string]string{"device_id": "2272", "topic_read": "obj/generated/" + geohashTopic}}
	fnRssi := &lynx.Function{ID: 2, Type: "rssi", InstallationID: 2269, Meta: map[string]string{"device_id": "2272", "topic_read": "obj/generated/" + rssiTopic}}
	fns := []*lynx.Function{fnGeo, fnRssi}

	// Provided datasets: timestamps with matching pairs. We'll append geohash entry
	// first, then rssi entry so that mapping can pick up the last seen geohash
	// message when processing the rssi entry.
	geohashMsgs := []struct {
		ts    float64
		msg   string
		value float64
	}{
		{1772029902, "Geohash3", 33.1337},
		{1772029901, "Geohash2", 22.1337},
		{1772029900, "Geohash1", 11.1337},
		{1772029587, "Geohash3", 33.1337},
		{1772029586, "Geohash2", 22.1337},
		{1772029585, "Geohash1", 11.1337},
		{1772027272.871, "Geohash4", 14.571557},
		{1772027262.871, "Geohash3", 13.571557},
		{1772027261.871, "Geohash", 13.371337},
	}
	rssiVals := []struct {
		ts    float64
		msg   string
		value float64
	}{
		{1772029902, "ABC", -33},
		{1772029901, "ABC", -22},
		{1772029900, "ABC", -11},
		{1772029587, "ABC", -33},
		{1772029586, "ABC", -22},
		{1772029585, "ABC", -11},
		{1772027272.871, "ABC", -77},
		{1772027262.871, "ABC", -67},
		{1772027261.871, "ABC", -56},
	}

	var logResult []lynx.LogEntry
	for i := range geohashMsgs {
		// geohash entry (messageFrom)
		logResult = append(logResult, lynx.LogEntry{
			Topic:     "2272/obj/generated/" + geohashTopic,
			Message:   geohashMsgs[i].msg,
			Timestamp: geohashMsgs[i].ts,
			Value:     geohashMsgs[i].value,
		})
		// rssi entry (will receive the last geohash message for that device)
		logResult = append(logResult, lynx.LogEntry{
			Topic:     "2272/obj/generated/" + rssiTopic,
			Message:   rssiVals[i].msg,
			Timestamp: rssiVals[i].ts,
			Value:     rssiVals[i].value,
		})
	}

	// run processMessageJoin: messageFrom is "geohash", linkKey is "device_id"
	res := processMessageJoin(fns, logResult, "device_id", "geohash")

	// rssi function (ID 2) should have messages replaced by the geohash messages
	got, ok := res[fnRssi.ID]
	if !ok {
		t.Fatalf("expected messages for rssi function id %d, got none", fnRssi.ID)
	}

	// expected messages equal the sequence of geohash messages in the same order
	var expected []string
	for _, g := range geohashMsgs {
		expected = append(expected, g.msg)
	}

	if !reflect.DeepEqual(got, expected) {
		t.Fatalf("mapped messages mismatch\nexpected: %v\n got: %v", expected, got)
	}

	// geohash function (ID 1) should not have appended messages because it's the source
	if _, ok := res[fnGeo.ID]; ok {
		t.Fatalf("expected no appended messages for source function id %d", fnGeo.ID)
	}

	// ensure we have the same number of mapped messages as rssi values and log pairs
	if len(got) != len(rssiVals) {
		t.Fatalf("expected %d mapped messages for rssi, got %d", len(rssiVals), len(got))
	}
	for i := range got {
		// log the mapped pair: rssi value and mapped geohash message
		t.Logf("rssi value=%v -> mapped geohash=%s", rssiVals[i].value, got[i])
	}

	// quick sanity: ensure timestamps are usable as times (no panic)
	for _, e := range logResult {
		_ = time.Unix(int64(e.Timestamp), 0)
	}
}
