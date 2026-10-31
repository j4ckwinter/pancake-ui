import { useState } from "react";
import { Button, Checkbox, Stack, Table } from "../../index";

export function TableContracts() {
  const [descending, setDescending] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [actions, setActions] = useState(0);
  const [submissions, setSubmissions] = useState(0);
  const rows = descending ? ["Beta", "Alpha"] : ["Alpha", "Beta"];
  return (
    <Stack>
      <Button>Before table</Button>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmissions((value) => value + 1);
        }}
      >
        <Table
          caption="Contract records"
          className="consumer-table"
          style={{ minWidth: 640, borderSpacing: 0 }}
          aria-describedby="table-guidance"
          data-contract="Table"
          ref={(node) => {
            if (node)
              node.dataset.refReady = String(node instanceof HTMLTableElement);
          }}
        >
          <colgroup>
            <col />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th
                scope="col"
                aria-sort={descending ? "descending" : "ascending"}
              >
                <Button
                  variant="secondary"
                  onClick={() => setDescending((value) => !value)}
                >
                  Sort record name
                </Button>
              </th>
              <th scope="col">Selection</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {empty ? (
              <tr>
                <td colSpan={3}>No matching records</td>
              </tr>
            ) : (
              rows.map((name) => (
                <tr key={name}>
                  <th scope="row">{name}</th>
                  <td>
                    <Checkbox
                      label={`Select ${name}`}
                      name="record"
                      value={name}
                    />
                  </td>
                  <td>
                    <Button onClick={() => setActions((value) => value + 1)}>
                      Inspect {name}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" colSpan={2}>
                Selected records
              </th>
              <td>
                <Button type="submit">Submit table selection</Button>
              </td>
            </tr>
          </tfoot>
        </Table>
      </form>
      <Button>After table</Button>
      <Button onClick={() => setEmpty((value) => !value)}>
        Toggle empty table
      </Button>
      <span id="table-guidance">Choose records before submitting.</span>
      <output aria-label="Table actions">{actions}</output>
      <output aria-label="Table submissions">{submissions}</output>
      <Table caption="Grouped table headers">
        <colgroup span={2} />
        <thead>
          <tr>
            <th id="table-group" scope="colgroup" colSpan={2}>
              Activity
            </th>
          </tr>
          <tr>
            <th id="table-period" scope="col">
              Period
            </th>
            <th id="table-total" scope="col">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th id="table-week" scope="row">
              This week
            </th>
            <td headers="table-group table-total table-week">12</td>
          </tr>
        </tbody>
      </Table>
    </Stack>
  );
}
