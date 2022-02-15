const indexcedColors: any = {
  '0': '#FF000000',
  '1': '#FFFFFFFF',
  '2': '#FFFF0000',
  '3': '#FF00FF00',
  '4': '#FF0000FF',
  '5': '#FFFFFF00',
  '6': '#FFFF00FF',
  '7': '#FF00FFFF',
  '8': '#FF000000',
  '9': '#FFFFFFFF',
  '10': '#FFFF0000',
  '11': '#FF00FF00',
  '12': '#FF0000FF',
  '13': '#FFFFFF00',
  '14': '#FFFF00FF',
  '15': '#FF00FFFF',
  '16': '#FF800000',
  '17': '#FF008000',
  '18': '#FF000080',
  '19': '#FF808000',
  '20': '#FF800080',
  '21': '#FF008080',
  '22': '#FFC0C0C0',
  '23': '#FF808080',
  '24': '#FF9999FF',
  '25': '#FF993366',
  '26': '#FFFFFFCC',
  '27': '#FFCCFFFF',
  '28': '#FF660066',
  '29': '#FFFF8080',
  '30': '#FF0066CC',
  '31': '#FFCCCCFF',
  '32': '#FF000080',
  '33': '#FFFF00FF',
  '34': '#FFFFFF00',
  '35': '#FF00FFFF',
  '36': '#FF800080',
  '37': '#FF800000',
  '38': '#FF008080',
  '39': '#FF0000FF',
  '40': '#FF00CCFF',
  '41': '#FFCCFFFF',
  '42': '#FFCCFFCC',
  '43': '#FFFFFF99',
  '44': '#FF99CCFF',
  '45': '#FFFF99CC',
  '46': '#FFCC99FF',
  '47': '#FFFFCC99',
  '48': '#FF3366FF',
  '49': '#FF33CCCC',
  '50': '#FF99CC00',
  '51': '#FFFFCC00',
  '52': '#FFFF9900',
  '53': '#FFFF6600',
  '54': '#FF666699',
  '55': '#FF969696',
  '56': '#FF003366',
  '57': '#FF339966',
  '58': '#FF003300',
  '59': '#FF333300',
  '60': '#FF993300',
  '61': '#FF993366',
  '62': '#FF333399',
  '63': '#FF333333',
}

const themes = ['#FFFFFF', '#000000', '#E7E6E6', '#44546A', '#5B9BD5', '#ED7D31', '#A5A5A5', '#FFC000', '#4472C4', '#70AD47'];

export class ExcelCell{

  address: string | undefined;
  cellNumber: number | undefined;
  height: number | undefined;
  s_height: number | undefined;
  style: any | undefined;
  width: number | undefined;
  value: any | undefined;
  merge: boolean = false;
  cellStyle: any;
  cellValue: any | undefined;




  constructor(address: string | undefined, cellNumber: number | undefined, height: number | undefined, style: any | undefined,
              width: number | undefined, value: string | undefined, merge: boolean, s_height: number | undefined) {
    this.address = address;
    this.cellNumber = cellNumber;
    this.height = height;
    this.style = style;
    this.width = width;
    this.value = value;
    this.merge = merge;
    this.s_height = s_height;
    this.getCellStyle();
    this.getCellValue();
  }

  getCellStyle() {
    const {style} = this;
    const result: any = {};
    if (style) {
      if (style.font?.size) {
        result['font-size'] = `${style.font.size}px`;
      }
      if (style.font?.bold) {
        result['font-weight'] = 'bold';
      }
      if (style.font?.color?.argb) {
        result['color'] = `#${style.font.color.argb.slice(-6)}`;
      }

      if (typeof this.value === 'number') {
        result['justify-content'] = 'flex-end';
      }
      if (style.alignment) {
        const alignment: any = {
          middle: 'center',
          center: 'center',
          top: 'flex-start',
          bottom: 'flex-end',
          left: 'flex-start',
          right: 'flex-end'
        }
        if (style.alignment.vertical) {
          result['align-items'] = alignment[style.alignment.vertical];
        }
        if (style.alignment.horizontal) {
          result['justify-content'] = alignment[style.alignment.horizontal];
        }
      }
      if (style.fill?.color?.indexed < 64) {
        const index = (style.fill?.color?.indexed || 0).toString();
        result['background'] = indexcedColors[index];
      }
      if (style.fill?.fgColor?.argb) {
        result['background'] = `#${style.fill.fgColor.argb.slice(-6)}`;
      }
      if (style.fill?.fgColor?.theme) {
        result['background'] = this.getTintColor(themes[style.fill.fgColor.theme], style.fill.fgColor.tint || 0);
      }
    }

    if (this.merge) {
      result['width'] = this.width + 'px';
      result['height'] = this.height + 'px' || '100%';
      result['z-index'] = 1;
      if (!result.background) {
        result['background'] = '#fff';
      }
    }

    this.cellStyle = result;
  }

  getCellValue() {
    if (typeof this.value === 'object' && this.value.richText) {
      return this.cellValue = this.value.richText.map((d: any) => d.text);
    }
    return this.cellValue = this.value;
  }

  private getTintColor(hex:string, tint:number) {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });

    const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!rgb) {
      return null;
    }
    const r = parseInt(rgb[1], 16);
    const g = parseInt(rgb[2], 16);
    const b = parseInt(rgb[3], 16);

    if (tint >= 0) {
      return this.rgbToHex(r + ((255 - r) * tint), g + ((255 - g) * tint), b + ((255 - b) * tint));
    } else {
      return this.rgbToHex(r * (1 - (tint * -1)), g * (1 - (tint * -1)), b * (1 - (tint * -1)));
    }
  }

  private rgbToHex(r:number, g:number, b:number) {
    return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
  }


}
