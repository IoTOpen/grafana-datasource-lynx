package plugin

// BackendQueryRequest request model for resource endpoint
type BackendQueryRequest struct {
	RefID          string `json:"refId"`
	InstallationID int64  `json:"installationId"`
	Meta           []struct {
		Key   string `json:"key"`
		Value string `json:"value"`
	} `json:"meta"`
	StateOnly      bool    `json:"stateOnly"`
	Type           string  `json:"type"`
	TableData      bool    `json:"tabledata"`
	MetaAsFields   bool    `json:"metaAsFields"`
	JoinDeviceMeta bool    `json:"joinDeviceMeta"`
	LinkKey        string  `json:"linkKey"`
	MessageFrom    string  `json:"messageFrom"`
	GroupBy        string  `json:"groupBy"`
	NameBy         string  `json:"nameBy"`
	From           float64 `json:"from"`
	To             float64 `json:"to"`
	MetaAsLabels   bool    `json:"metaAsLabels"`
	AggrMethod     string  `json:"aggrMethod"`
	AggrInterval   string  `json:"aggrInterval"`
}
