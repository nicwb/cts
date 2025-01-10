export const convertDate = (date: string) => {
    const dateTime = new Date(date);
    const formattedDateTime = dateTime.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
    const formattedTime = dateTime.toLocaleString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    });
    const finalFormat = `${formattedDateTime}, ${formattedTime}`;
    return finalFormat;
};
