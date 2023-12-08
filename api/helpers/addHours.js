const addHours = (date, hours) => {
    date.setHours(date.getHours() + hours);
  
    return date;
};

module.exports = addHours;