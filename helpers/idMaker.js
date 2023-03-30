const idMaker = (inicial) => {
    let dateTime = new Date().toJSON().split('T');
    let date = dateTime[0].replaceAll('-','');
    let time = dateTime[1].split('.')[0].replaceAll(':','');
    let id = `${inicial}_${date}_${time}`;
    return id;
}

module.exports = {idMaker}