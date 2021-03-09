exports.handler = async (event) => {
    /* Add number1 and number2, return the result */
    console.log('[debug]', 'running dummy lambda');
    const response = event.arguments.number1 + event.arguments.number2

    console.log('[debug]', 'running dummy lambda: ', response);
    return response;
};
