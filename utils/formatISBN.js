const formatISBN = (isbn) => {
    if (isbn.length === 13) {
      return `${isbn.slice(0, 3)}-${isbn.slice(3, 4)}-${isbn.slice(4, 6)}-${isbn.slice(6, 12)}-${isbn.slice(12)}`;
    }
    return isbn;
  };

  module.exports = {formatISBN};