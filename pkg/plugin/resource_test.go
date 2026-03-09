package plugin

import (
	"sort"
	"testing"

	"github.com/IoTOpen/go-lynx"
)

func Test_resolveJoinedMessage_withProvidedLogData(t *testing.T) {
	t.Parallel()

	type logEntry struct {
		timestamp float64
		topic     string
		message   string
	}

	type resolvedRow struct {
		timestamp float64
		value     float64
		message   string
	}

	const (
		linkValue = "2272"
		latiTopic = "obj/generated/f8208fc4-e081-4caf-8ab5-3a269d98b1db"
		rssiTopic = "obj/generated/bf24598e-78d2-4b8a-926a-35f5a528a80b"
	)

	entries := []logEntry{
		{timestamp: 1772029902, topic: latiTopic, message: "Geohash3"},
		{timestamp: 1772029902, topic: rssiTopic, message: "ABC"},
		{timestamp: 1772029901, topic: latiTopic, message: "Geohash2"},
		{timestamp: 1772029901, topic: rssiTopic, message: "ABC"},
		{timestamp: 1772029900, topic: latiTopic, message: "Geohash1"},
		{timestamp: 1772029900, topic: rssiTopic, message: "ABC"},
		{timestamp: 1772029587, topic: latiTopic, message: "Geohash3"},
		{timestamp: 1772029587, topic: rssiTopic, message: "ABC"},
		{timestamp: 1772029586, topic: latiTopic, message: "Geohash2"},
		{timestamp: 1772029586, topic: rssiTopic, message: "ABC"},
		{timestamp: 1772029585, topic: latiTopic, message: "Geohash1"},
		{timestamp: 1772029585, topic: rssiTopic, message: "ABC"},
		{timestamp: 1772027272.871, topic: latiTopic, message: "Geohash4"},
		{timestamp: 1772027272.871, topic: rssiTopic, message: "ABC"},
		{timestamp: 1772027262.871, topic: latiTopic, message: "Geohash3"},
		{timestamp: 1772027262.871, topic: rssiTopic, message: "ABC"},
		{timestamp: 1772027261.871, topic: latiTopic, message: "Geohash"},
		{timestamp: 1772027261.871, topic: rssiTopic, message: "ABC"},
	}

	rssiValues := map[float64]float64{
		1772027261.871: -56,
		1772027262.871: -67,
		1772027272.871: -77,
		1772029585:     -11,
		1772029586:     -22,
		1772029587:     -33,
		1772029900:     -11,
		1772029901:     -22,
		1772029902:     -33,
	}

	exactByLinkAndTime := make(map[string]string)
	for _, entry := range entries {
		if entry.topic != latiTopic {
			continue
		}
		exactByLinkAndTime[messageJoinKey(linkValue, entry.timestamp)] = entry.message
	}

	lastByLink := make(map[string]string)
	rows := make([]resolvedRow, 0, len(rssiValues))
	for _, entry := range entries {
		if entry.topic == latiTopic {
			lastByLink[linkValue] = entry.message
			continue
		}
		if entry.topic != rssiTopic {
			continue
		}
		message, ok := resolveJoinedMessage(exactByLinkAndTime, lastByLink, linkValue, entry.timestamp)
		if !ok {
			t.Fatalf("expected message for timestamp %v", entry.timestamp)
		}
		rows = append(rows, resolvedRow{
			timestamp: entry.timestamp,
			value:     rssiValues[entry.timestamp],
			message:   message,
		})
	}

	want := []resolvedRow{
		{timestamp: 1772029902, value: -33, message: "Geohash3"},
		{timestamp: 1772029901, value: -22, message: "Geohash2"},
		{timestamp: 1772029900, value: -11, message: "Geohash1"},
		{timestamp: 1772029587, value: -33, message: "Geohash3"},
		{timestamp: 1772029586, value: -22, message: "Geohash2"},
		{timestamp: 1772029585, value: -11, message: "Geohash1"},
		{timestamp: 1772027272.871, value: -77, message: "Geohash4"},
		{timestamp: 1772027262.871, value: -67, message: "Geohash3"},
		{timestamp: 1772027261.871, value: -56, message: "Geohash"},
	}

	if len(rows) != len(want) {
		t.Fatalf("expected %d rows, got %d", len(want), len(rows))
	}

	for i := range want {
		if rows[i] != want[i] {
			t.Fatalf("row %d mismatch: want %+v, got %+v", i, want[i], rows[i])
		}
	}

	t.Log("resolved rows from provided data:")
	for _, row := range rows {
		t.Logf("timestamp=%.3f value=%.0f message=%s", row.timestamp, row.value, row.message)
	}
}

func Test_buildTableFrames_withProvidedLogData(t *testing.T) {
	t.Parallel()

	queryModel := &BackendQueryRequest{
		InstallationID: 2269,
		TableData:      true,
		MessageFrom:    "lati",
		NameBy:         "name",
		LinkKey:        "device_id",
	}

	functions := []*lynx.Function{
		{
			ID:             1001,
			Type:           "*rssi",
			InstallationID: 2269,
			Meta: lynx.Meta{
				"name":       "rssi test",
				"device_id":  "2272",
				"topic_read": "obj/generated/bf24598e-78d2-4b8a-926a-35f5a528a80b",
			},
		},
		{
			ID:             1002,
			Type:           "lati",
			InstallationID: 2269,
			Meta: lynx.Meta{
				"name":       "lati test",
				"device_id":  "2272",
				"topic_read": "obj/generated/f8208fc4-e081-4caf-8ab5-3a269d98b1db",
			},
		},
	}

	logResult := []lynx.LogEntry{
		{Timestamp: 1772029902, Topic: "obj/generated/f8208fc4-e081-4caf-8ab5-3a269d98b1db", Message: "Geohash3", Value: 33.1337},
		{Timestamp: 1772029902, Topic: "obj/generated/bf24598e-78d2-4b8a-926a-35f5a528a80b", Message: "ABC", Value: -33},
		{Timestamp: 1772029901, Topic: "obj/generated/f8208fc4-e081-4caf-8ab5-3a269d98b1db", Message: "Geohash2", Value: 22.1337},
		{Timestamp: 1772029901, Topic: "obj/generated/bf24598e-78d2-4b8a-926a-35f5a528a80b", Message: "ABC", Value: -22},
		{Timestamp: 1772029900, Topic: "obj/generated/f8208fc4-e081-4caf-8ab5-3a269d98b1db", Message: "Geohash1", Value: 11.1337},
		{Timestamp: 1772029900, Topic: "obj/generated/bf24598e-78d2-4b8a-926a-35f5a528a80b", Message: "ABC", Value: -11},
		{Timestamp: 1772029587, Topic: "obj/generated/f8208fc4-e081-4caf-8ab5-3a269d98b1db", Message: "Geohash3", Value: 33.1337},
		{Timestamp: 1772029587, Topic: "obj/generated/bf24598e-78d2-4b8a-926a-35f5a528a80b", Message: "ABC", Value: -33},
		{Timestamp: 1772029586, Topic: "obj/generated/f8208fc4-e081-4caf-8ab5-3a269d98b1db", Message: "Geohash2", Value: 22.1337},
		{Timestamp: 1772029586, Topic: "obj/generated/bf24598e-78d2-4b8a-926a-35f5a528a80b", Message: "ABC", Value: -22},
		{Timestamp: 1772029585, Topic: "obj/generated/f8208fc4-e081-4caf-8ab5-3a269d98b1db", Message: "Geohash1", Value: 11.1337},
		{Timestamp: 1772029585, Topic: "obj/generated/bf24598e-78d2-4b8a-926a-35f5a528a80b", Message: "ABC", Value: -11},
		{Timestamp: 1772027272.871, Topic: "obj/generated/f8208fc4-e081-4caf-8ab5-3a269d98b1db", Message: "Geohash4", Value: 14.571557},
		{Timestamp: 1772027272.871, Topic: "obj/generated/bf24598e-78d2-4b8a-926a-35f5a528a80b", Message: "ABC", Value: -77},
		{Timestamp: 1772027262.871, Topic: "obj/generated/f8208fc4-e081-4caf-8ab5-3a269d98b1db", Message: "Geohash3", Value: 13.571557},
		{Timestamp: 1772027262.871, Topic: "obj/generated/bf24598e-78d2-4b8a-926a-35f5a528a80b", Message: "ABC", Value: -67},
		{Timestamp: 1772027261.871, Topic: "obj/generated/99635453-b6db-4bb1-8309-449b8157361c", Message: "hej", Value: 1337},
		{Timestamp: 1772027261.871, Topic: "obj/generated/f8208fc4-e081-4caf-8ab5-3a269d98b1db", Message: "Geohash", Value: 13.371337},
		{Timestamp: 1772027261.871, Topic: "obj/generated/bf24598e-78d2-4b8a-926a-35f5a528a80b", Message: "ABC", Value: -56},
	}
	sort.SliceStable(logResult, func(i, j int) bool {
		return logResult[i].Timestamp < logResult[j].Timestamp
	})

	frames, err := buildTableFrames(
		queryModel,
		functions,
		map[int64]*lynx.Device{},
		createLogTopicMappings(functions),
		logResult,
		createMetaColumns(queryModel, map[int64]*lynx.Device{}, functions),
	)
	if err != nil {
		t.Fatalf("buildTableFrames returned error: %v", err)
	}
	if len(frames) != 1 {
		t.Fatalf("expected 1 frame, got %d", len(frames))
	}

	frame := frames[0]
	if frame.Name != "rssi test" {
		t.Fatalf("expected frame name rssi test, got %q", frame.Name)
	}
	if len(frame.Fields) != 4 {
		t.Fatalf("expected 4 fields, got %d", len(frame.Fields))
	}

	type frameRow struct {
		timeMillis int64
		name       string
		value      float64
		message    string
	}

	rows := make([]frameRow, 0, frame.Fields[0].Len())
	for i := 0; i < frame.Fields[0].Len(); i++ {
		timestamp, ok := frame.Fields[0].At(i).(interface{ UnixMilli() int64 })
		if !ok {
			t.Fatalf("unexpected time field type at row %d: %T", i, frame.Fields[0].At(i))
		}
		name, ok := frame.Fields[1].At(i).(string)
		if !ok {
			t.Fatalf("unexpected name field type at row %d: %T", i, frame.Fields[1].At(i))
		}
		value, err := frame.Fields[2].FloatAt(i)
		if err != nil {
			t.Fatalf("unexpected value field at row %d: %v", i, err)
		}
		message, ok := frame.Fields[3].At(i).(string)
		if !ok {
			t.Fatalf("unexpected message field type at row %d: %T", i, frame.Fields[3].At(i))
		}
		rows = append(rows, frameRow{
			timeMillis: timestamp.UnixMilli(),
			name:       name,
			value:      value,
			message:    message,
		})
	}

	want := []frameRow{
		{timeMillis: 1772027261871, name: "rssi test", value: -56, message: "Geohash"},
		{timeMillis: 1772027262871, name: "rssi test", value: -67, message: "Geohash3"},
		{timeMillis: 1772027272871, name: "rssi test", value: -77, message: "Geohash4"},
		{timeMillis: 1772029585000, name: "rssi test", value: -11, message: "Geohash1"},
		{timeMillis: 1772029586000, name: "rssi test", value: -22, message: "Geohash2"},
		{timeMillis: 1772029587000, name: "rssi test", value: -33, message: "Geohash3"},
		{timeMillis: 1772029900000, name: "rssi test", value: -11, message: "Geohash1"},
		{timeMillis: 1772029901000, name: "rssi test", value: -22, message: "Geohash2"},
		{timeMillis: 1772029902000, name: "rssi test", value: -33, message: "Geohash3"},
	}

	if len(rows) != len(want) {
		t.Fatalf("expected %d frame rows, got %d", len(want), len(rows))
	}

	for i := range want {
		if rows[i] != want[i] {
			t.Fatalf("frame row %d mismatch: want %+v, got %+v", i, want[i], rows[i])
		}
	}

	t.Log("frame rows from provided data:")
	for _, row := range rows {
		t.Logf("timeMillis=%d name=%s value=%.0f message=%s", row.timeMillis, row.name, row.value, row.message)
	}
}

func Test_resolveJoinedMessage_fallsBackToLastKnown(t *testing.T) {
	t.Parallel()

	exactByLinkAndTime := map[string]string{}
	lastByLink := map[string]string{
		"2272": "Geohash3",
	}

	got, ok := resolveJoinedMessage(exactByLinkAndTime, lastByLink, "2272", 1772027272.871)
	if !ok {
		t.Fatalf("expected fallback message to be found")
	}
	if got != "Geohash3" {
		t.Fatalf("expected fallback Geohash3, got %q", got)
	}
}

func Test_resolveJoinedMessage_returnsMissingWhenNoExactOrFallback(t *testing.T) {
	t.Parallel()

	got, ok := resolveJoinedMessage(map[string]string{}, map[string]string{}, "2272", 1772027272.871)
	if ok {
		t.Fatalf("expected no message, got %q", got)
	}
}

func Test_timestampToUnixNano_handlesFractionalSeconds(t *testing.T) {
	t.Parallel()

	got := timestampToUnixNano(1772027262.871)
	const want int64 = 1772027262871000000
	if got != want {
		t.Fatalf("expected %d, got %d", want, got)
	}
}
