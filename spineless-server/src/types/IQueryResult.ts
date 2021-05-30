
export interface IQueryResult {
  items: any[];
  _meta: {
    skipped: number;
    returned: number;
    total: number;
  }
}
