

exports.handler = async (event) => {
    const response = event.arguments.msg
    console.log('[debug]', 'echoing', response);
    return response;
};
