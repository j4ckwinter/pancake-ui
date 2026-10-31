import { useState } from "react";
import { Button, Checkbox, Pagination, Stack } from "../../index";

export function PaginationContracts() {
  const [page, setPage] = useState(3);
  const [count, setCount] = useState(10);
  const [hold, setHold] = useState(false);
  const [changes, setChanges] = useState("");
  const [submissions, setSubmissions] = useState(0);
  return (
    <Stack>
      <Checkbox
        label="Hold pagination updates"
        checked={hold}
        onCheckedChange={setHold}
      />
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmissions((value) => value + 1);
        }}
      >
        <Button>Before pagination</Button>
        <Pagination
          label="Contract pagination"
          page={page}
          pageCount={count}
          onPageChange={(value) => {
            setChanges((previous) => `${previous}${value},`);
            if (!hold) setPage(value);
          }}
          ref={(node) => {
            if (node) node.dataset.refReady = String(node.tagName === "NAV");
          }}
          className="consumer-pagination"
          style={{ borderRadius: 0 }}
          aria-describedby="pagination-guidance"
        />
        <Button>After pagination</Button>
      </form>
      <span id="pagination-guidance">Choose a results page</span>
      <Button onClick={() => setCount(2)}>Shrink pagination count</Button>
      <Pagination
        label="Linked pagination"
        page={1}
        pageCount={3}
        getPageHref={(value) => `#pagination-page-${value}`}
        linkProps={{ target: "_self", rel: "help" }}
      />
      <Pagination
        label="Last linked pagination"
        page={3}
        pageCount={3}
        getPageHref={(value) => `#pagination-page-${value}`}
      />
      <Pagination
        label="Empty pagination"
        page={1}
        pageCount={0}
        onPageChange={(value) => setChanges(String(value))}
      />
      <Pagination
        label="Single pagination"
        page={99}
        pageCount={1}
        onPageChange={(value) => setChanges(String(value))}
      />
      <Pagination
        label="Invalid pagination"
        page={Number.NaN}
        pageCount={Number.POSITIVE_INFINITY}
        onPageChange={(value) => setChanges(String(value))}
      />
      <Pagination
        label="Fractional pagination"
        page={2.9}
        pageCount={4.7}
        onPageChange={(value) => setChanges(String(value))}
      />
      <Pagination
        label="Huge pagination"
        page={Number.MAX_SAFE_INTEGER - 1}
        pageCount={Number.MAX_SAFE_INTEGER}
        onPageChange={(value) => setChanges(String(value))}
      />
      <Pagination
        label="Localized pagination"
        page={5}
        pageCount={20}
        dir="rtl"
        labels={{
          previous: "Previous results page with a very long label",
          next: "Next results page with a very long label",
          page: (value) => `Result page ${value}`,
        }}
        onPageChange={(value) => setChanges(String(value))}
      />
      <output aria-label="Pagination changes">{changes}</output>
      <output aria-label="Pagination submissions">{submissions}</output>
    </Stack>
  );
}
