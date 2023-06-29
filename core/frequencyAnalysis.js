module.exports = {
  countLetters: (paragraph) => {
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

    return countedLetters.slice(0, 8);
  },

  switchLetters: (paragraph, letterArray) => {
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
  },
};
