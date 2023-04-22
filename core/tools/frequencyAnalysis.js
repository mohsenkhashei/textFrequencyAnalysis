export const countLetters = (paragraph) => {
  const letterCounts = {};

  for (let i = 0; i < paragraph.length; i++) {
    const char = paragraph[i].toLowerCase();

    // If the character is a letter (a-z or German/French/Russian/Turkish characters), increment its count in the letterCounts object
    if (char.match(/[a-zA-Zäöüßàâäéèêëîïôöûüçşğ]/i)) {
      if (letterCounts[char]) {
        letterCounts[char]++;
      } else {
        letterCounts[char] = 1;
      }
    }
  }

  const countedLetters = [];

  for (let letter in letterCounts) {
    countedLetters.push({ letter: letter, count: letterCounts[letter] });
  }

  countedLetters.sort((a, b) => b.count - a.count);

  return countedLetters;
};

export const switchLetters = (paragraph, letterArray) => {
  const letterKeys = Object.keys(letterArray); // Get the keys of the letterArray
  const letterValues = Object.values(letterArray); // Get the values of the letterArray

  // Convert the paragraph and letterKeys to lowercase for case-insensitive comparison
  const lowerCaseParagraph = paragraph.toLowerCase();
  const lowerCaseLetterKeys = letterKeys.map((key) => key.toLowerCase());

  // Loop through each character in the paragraph
  let result = "";
  for (let i = 0; i < paragraph.length; i++) {
    const char = paragraph[i];
    const index = lowerCaseLetterKeys.indexOf(char.toLowerCase()); // Find the index of the character in the lowerCaseLetterKeys array

    // If the character is a letter and its corresponding value exists in the letterArray, append the value to the result
    if (index !== -1 && letterValues[index]) {
      result += letterValues[index];
    } else {
      result += char; // If the character is not found in the letterArray, append it as it is
    }
  }

  return result;
};

// Example usage:

// let paragraph =
//   "GFS WMY OG LGDVS MF SFNKYHOSU ESLLMRS, PC WS BFGW POL DMFRQMRS, PL OG CPFU M UPCCSKSFO HDMPFOSXO GC OIS LMES DMFRQMRS DGFR SFGQRI OG CPDD GFS LISSO GK LG, MFU OISF WS NGQFO OIS GNNQKKSFNSL GC SMNI DSOOSK. WS NMDD OIS EGLO CKSJQSFODY GNNQKKPFR DSOOSK OIS 'CPKLO', OIS FSXO EGLO GNNQKKPFR DSOOSK OIS 'LSNGFU' OIS CGDDGWPFR EGLO GNNQKKPFR DSOOSK OIS 'OIPKU', MFU LG GF, QFOPD WS MNNGQFO CGK MDD OIS UPCCSKSFO DSOOSKL PF OIS HDMPFOSXO LMEHDS. OISF WS DGGB MO OIS NPHISK OSXO WS WMFO OG LGDVS MFU WS MDLG NDMLLPCY POL LYEAGDL. WS CPFU OIS EGLO GNNQKKPFR LYEAGD MFU NIMFRS PO OG OIS CGKE GC OIS 'CPKLO' DSOOSK GC OIS HDMPFOSXO LMEHDS, OIS FSXO EGLO NGEEGF LYEAGD PL NIMFRSU OG OIS CGKE GC OIS 'LSNGFU' DSOOSK, MFU OIS CGDDGWPFR EGLO NGEEGF LYEAGD PL NIMFRSU OG OIS CGKE GC OIS 'OIPKU' DSOOSK, MFU LG GF, QFOPD WS MNNGQFO CGK MDD LYEAGDL GC OIS NKYHOGRKME WS WMFO OG LGDVS.";
// const countedLetters = countLetters(paragraph);
// console.log(countedLetters);

// const letterArray = { G: "T" };
// const switchedParagraph = switchLetters(paragraph, letterArray);
// console.log(switchedParagraph);
// const countedLetters2 = countLetters(switchedParagraph);
// console.log(countedLetters2);
