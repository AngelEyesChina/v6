"use strict";

exports.sortByDisplayOrderAndID = function _sortByDisplayOrderAndID(a, b) {
  a.displayOrder = a.displayOrder || 999;
  b.displayOrder = b.displayOrder || 999;
  if (a.displayOrder !== b.displayOrder) {
    return (a.displayOrder < b.displayOrder) ? -1 : (a.displayOrder > b.displayOrder) ? 1 : 0;
  }
  else {if(!a.getID) console.log(a);
    return (a.getID() < b.getID()) ? -1 : 1;
  }
};