const validateDate = (date) => {

    const regExValidateDate = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;

    return date.match(regExValidateDate)
}

module.exports = validateDate;