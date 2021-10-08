
export const HexColourLuminosity = (hexColour: string): number =>{
    const redLuminosityWeighting = 0.299;
    const greenLuminosityWeighting = 0.587;
    const blueLuminosityWeighting = 0.114;

    const numberOfColours = 255;
    const hexSubstrSize = 2;
    const greenHexStartPos = 2;
    const redHexStartPos = 4;
    if  (hexColour) {
    const hexColourNoHash: string = hexColour.replace(/#/, '');
    const redHexVal: number = parseInt(hexColourNoHash.substr(0, hexSubstrSize), 16);
    const greenHexVal: number = parseInt(hexColourNoHash.substr(greenHexStartPos, hexSubstrSize), 16);
    const blueHexVal: number = parseInt(hexColourNoHash.substr(redHexStartPos, hexSubstrSize), 16);

    return (redLuminosityWeighting * redHexVal
        + greenLuminosityWeighting * greenHexVal
        + blueLuminosityWeighting * blueHexVal) / numberOfColours;
    }
  }