export class ExcelRow {
    constructor(rowNumber, hidden, height, cells, row) {
        this.row = row;
        this.rowNumber = 0;
        this.height = 0;
        this.hidden = false;
        this.cells = [];
        this.selected = false;
        this.rowNumber = rowNumber;
        this.hidden = hidden;
        this.height = height;
        this.cells = cells;
    }
    get values() {
        return this.row.values;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhjZWwtcm93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbmctZXhjZWwvc3JjL2xpYi9jbGFzcy9leGNlbC1yb3cudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsTUFBTSxPQUFPLFFBQVE7SUFRbkIsWUFBWSxTQUFpQixFQUFFLE1BQWUsRUFBRSxNQUFjLEVBQUUsS0FBa0IsRUFBVSxHQUFRO1FBQVIsUUFBRyxHQUFILEdBQUcsQ0FBSztRQU5wRyxjQUFTLEdBQVcsQ0FBQyxDQUFDO1FBQ3RCLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFDbkIsV0FBTSxHQUFZLEtBQUssQ0FBQztRQUN4QixVQUFLLEdBQWdCLEVBQUUsQ0FBQztRQUN4QixhQUFRLEdBQVksS0FBSyxDQUFDO1FBR3hCLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxJQUFJLE1BQU07UUFDUixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQ3pCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RXhjZWxDZWxsfSBmcm9tICcuL2V4Y2VsLWNlbGwnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEV4Y2VsUm93IHtcclxuXHJcbiAgcm93TnVtYmVyOiBudW1iZXIgPSAwO1xyXG4gIGhlaWdodDogbnVtYmVyID0gMDtcclxuICBoaWRkZW46IGJvb2xlYW4gPSBmYWxzZTtcclxuICBjZWxsczogRXhjZWxDZWxsW10gPSBbXTtcclxuICBzZWxlY3RlZDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihyb3dOdW1iZXI6IG51bWJlciwgaGlkZGVuOiBib29sZWFuLCBoZWlnaHQ6IG51bWJlciwgY2VsbHM6IEV4Y2VsQ2VsbFtdLCBwcml2YXRlIHJvdzogYW55KSB7XHJcbiAgICB0aGlzLnJvd051bWJlciA9IHJvd051bWJlcjtcclxuICAgIHRoaXMuaGlkZGVuID0gaGlkZGVuO1xyXG4gICAgdGhpcy5oZWlnaHQgPSBoZWlnaHQ7XHJcbiAgICB0aGlzLmNlbGxzID0gY2VsbHM7XHJcbiAgfVxyXG5cclxuICBnZXQgdmFsdWVzKCkge1xyXG4gICAgcmV0dXJuIHRoaXMucm93LnZhbHVlcztcclxuICB9XHJcbn1cclxuIl19