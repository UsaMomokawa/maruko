require("dotenv").config();

const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });
const moment = require("moment");

const owner = "UsaMomokawa"
const repo = "maruko"
const base = "main"
const branch = "patch-" + moment().format("YYYYMMDDmmss")
const refName = `refs/heads/${branch}`
const path = "README.md"

async function createPullRequest() {
  const origin = await octokit.git.getRef({
    owner: owner,
    repo: repo,
    ref: "heads/main"
  });

  // 新しいreferenceを作成
  // 同名のreferenceを作成することはできない
  // ref/heads/branchName
  await octokit.git.createRef({
    owner: owner,
    repo: repo,
    ref: refName,
    sha: origin.data.object.sha
  })

  // 対象ファイルを取得
  const content = await octokit.repos.getContent({
    owner: owner,
    repo: repo,
    ref: refName,
    path: path
  })
  const data = new Buffer.from(content.data.content, content.data.encoding).toString()
  console.log(data);

  // commit
  await octokit.repos.createOrUpdateFileContents({
    owner: owner,
    repo: repo,
    path: path,
    message: 'update README.md', // コミットメッセージ
    content: new Buffer.from(`${ data }hi!`).toString('base64'), // base64にエンコードする
    sha: content.data.sha,
    branch: branch
  })

  // PR
  const result = await octokit.pulls.create({
    owner: owner,
    repo: repo,
    head: branch,
    base: base,
    title: 'テストPR',
    body: 'みてくれ〜！'
  });
  console.log(result);
}
createPullRequest();
