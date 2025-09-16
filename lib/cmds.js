const commands = [];

const gmd = (info, func) => {
    const data = {
        ...info, 
        function: func,
        dontAddCommandList: info.dontAddCommandList ?? false, 
        desc: info.desc || '',
        fromMe: info.fromMe ?? false, 
        category: info.category || 'general', 
        filename: info.filename || "Not Provided"
    };
    commands.push(data);
    return data;
};

module.exports = {
    gmd,
    AddCommand: gmd,
    Function: gmd,
    Module: gmd,
    commands
};
