const exec = require('child_process').exec;

function FreeSpace() {}

FreeSpace.prototype.getStats = function(filterOn) {


    //let filterOn={'mounted on':'/'}

    return new Promise((resolve, reject) => {
        exec("df -h | awk '{print $1, $2, $3, $5, $6, $7, $8, $9, $10}'", (err, stdout, stderr) => {
            if (err) {
                reject(err);
                return;
            }


            let result = stdout.split("\n").filter((line) => {
                return line && line !== '';
            }).map((line) => {
                return line.trim().split(' ').map((item) => {
                    return item.trim();
                });
            });


            //console.log(result);

            let fields = result.shift();

            let i = fields.indexOf('on');
            if (i > 0) {
                fields.splice(i, 1);
                fields[i - 1] += " on";
            }

            result = result.map((record) => {


                //console.log(record.length + ' ' + fields.length);

                while (record.length > fields.length) {
                    let pre = record.slice(0, 2).join(' ');
                    record = ([pre]).concat(record.slice(2));
                   //console.log(record);
                }

                let obj = {};
                fields.forEach((f, i) => {
                    obj[f.toLowerCase()] = record[i];
                })
                return obj;

            });


            result=result.map((record)=>{

                (['iused', 'ifree']).forEach((k)=>{
                    if(record[k]){
                        delete record[k];
                    }
                });

                return record;


            });



            result = result.filter((record) => {
                var keys = Object.keys(filterOn);
                var matches = keys.filter((k) => {
                    return record[k] === filterOn[k];
                });

                return (matches.length === keys.length);

            });

            resolve(result);

        });
    });
};


module.exports.FreeSpace = FreeSpace;