export const DateFormatter = (date: Date) => {
    console.log(date)
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
}