declare module 'xlsx' {
    interface WorkBook {
        SheetNames: string[];
        Sheets: Record<string, WorkSheet>;
    }
    interface WorkSheet {
        [key: string]: any;
        '!ref'?: string;
        '!cols'?: Array<{ wch?: number }>;
        '!merges'?: Array<{
            s: { r: number; c: number };
            e: { r: number; c: number };
        }>;
    }
    interface CellObject {
        v?: any;
        z?: string;
    }
    interface XLSXUtils {
        book_new(): WorkBook;
        book_append_sheet(wb: WorkBook, ws: WorkSheet, name: string): void;
        aoa_to_sheet(data: any[][]): WorkSheet;
        encode_cell(cell: { r: number; c: number }): string;
    }
    const utils: XLSXUtils;
    function writeFile(wb: WorkBook, filename: string): void;
}
