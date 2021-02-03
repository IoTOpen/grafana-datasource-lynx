package datasource

// BackendQueryRequest request model for resource endpoint
type BackendQueryRequest struct {
	RefID          string `json:"refId"`
	InstallationID int64  `json:"installationId"`
	ClientID       int64  `json:"clientId"`
	Meta           []struct {
		Key   string `json:"key"`
		Value string `json:"value"`
	} `json:"meta"`
	StateOnly    bool    `json:"stateOnly"`
	Type         string  `json:"type"`
	TableData    bool    `json:"tabledata"`
	MetaAsFields bool    `json:"metaAsFields"`
	LinkKey      string  `json:"linkKey"`
	MessageFrom  string  `json:"messageFrom"`
	GroupBy      string  `json:"groupBy"`
	NameBy       string  `json:"nameBy"`
	From         float64 `json:"from"`
	To           float64 `json:"to"`
}

// TimeSeriesQueryResponse response model for TimeSeries querys
type TimeSeriesQueryResponse struct {
	RefID      string      `json:"refId"`
	Target     string      `json:"target"`
	Datapoints [][]float64 `json:"datapoints"`
}

// TableDataQueryResponse response model for TableData querys
type TableDataQueryResponse struct {
	RefID   string          `json:"refId"`
	Name    string          `json:"name"`
	Columns []Column        `json:"columns"`
	Rows    [][]interface{} `json:"rows"`
}

// Column ...
type Column struct {
	Text string `json:"text"`
}

// InstanceContext request context
type InstanceContext struct {
	APIkey string `json:"apiKey"`
	URL    string `json:"url"`
}
