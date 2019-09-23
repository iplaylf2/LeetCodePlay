const fs = require("fs").promises;

const main = async function() {
  const codeNameArray = await fs.readdir("code");

  const intro = `
目前进度为${codeNameArray.length}条。  
`;

  const table = await (async () => {
    const taskArray = [];
    for (const name of codeNameArray) {
      taskArray.push(
        (async () => {
          const leetCodeCell = `[${name}](https://leetcode-cn.com/problems/${name}/)`;
          const meyCodeCell = `[code](https://github.com/Iplaylf2/LeetCodePlay/tree/master/code/${name})`;
          var remarkCell = "";
          try {
            const remarkContent = await fs.readFile(
              `code/${name}/remark.txt`,
              "utf-8",
              "r+"
            );
            if (remarkContent.length > 10) {
              remarkCell = `[${remarkContent.substring(
                0,
                7
              )}...](https://github.com/Iplaylf2/LeetCodePlay/tree/master/code/${name}/remark.txt)`;
            } else {
              remarkCell = remarkContent;
            }
          } catch {}
          return `|${leetCodeCell}|${meyCodeCell}|${remarkCell}|`;
        })()
      );
    }

    const rowArray = await Promise.all(taskArray);

    const head = `
|leetcode-cn|my code|remark|
|:---------:|:-----:|:----:|
`;

    var body = rowArray.join("\n");
    return head + body;
  })();

  const mdContent = intro + table;
  fs.writeFile("README.md", mdContent);
};

main();
