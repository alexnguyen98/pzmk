import fs from "fs";
import path from "path";

export interface DataItem {
  kn_id?: number;
  lv?: string;
  par_kn_id?: number | null;
  row_id?: string;
  bud_kn_id?: number;
  typ?: string;
  podil?: string;
  podil_budovy?: string;
  def_point?: any;
  coordinates?: any;
  [key: string]: any;
}

class MockDB {
  private data: DataItem[] = [];

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      const dataPath = path.join(process.cwd(), "src", "data.json");
      const fileContent = fs.readFileSync(dataPath, "utf8");
      this.data = JSON.parse(fileContent);
      console.log(`Loaded ${this.data.length} items from data.json`);
    } catch (error) {
      console.error("Error loading data from data.json:", error);
      this.data = [];
    }
  }

  getAll(): DataItem[] {
    return this.data;
  }

  getById(id: number): DataItem | undefined {
    return this.data.find((item) => item.kn_id === id);
  }
}

export const db = new MockDB();
