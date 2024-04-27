# amplify-auth-social-provider-limited

🗑🗑🗑 Amplify FrameworkのSocial Providerによる認証で、ホワイトリストによるサインアップ制限をしてみる！  

[![ci](https://github.com/osawa-koki/amplify-auth-social-provider-limited/actions/workflows/ci.yml/badge.svg)](https://github.com/osawa-koki/amplify-auth-social-provider-limited/actions/workflows/ci.yml)
[![cd](https://github.com/osawa-koki/amplify-auth-social-provider-limited/actions/workflows/cd.yml/badge.svg)](https://github.com/osawa-koki/amplify-auth-social-provider-limited/actions/workflows/cd.yml)

![成果物](./fruit.gif)  

## 準備

```shell
# `Amplify CLI`をインストール
yarn global add @aws-amplify/cli

# Amplifyの認証
amplify configure

# プロジェクトの初期化
amplify init

# プロジェクトにホスティング機能を追加
amplify add hosting

# プロジェクトに認証機能を追加  
amplify add auth

# プロジェクトをプッシュ
amplify push

# プロジェクトを公開
amplify publish

# -----

# モジュールをインストール
yarn install

# ローカルサーバーを起動
yarn dev
```

## デプロイ

`v-*`という形式のタグをつけると、GitHub Actionsで自動的にデプロイされます。  
GitHub Actionsのシークレット情報として以下の情報を設定してください。  

| シークレット名 | 説明 |
| --- | --- |
| AWS_ACCESS_KEY_ID | AWSのアクセスキー |
| AWS_SECRET_ACCESS_KEY | AWSのシークレットアクセスキー |
| AWS_REGION | AWSのリージョン |

---

今回は、SSMを使用して登録可能なメールアドレスの正規表現パターンを保持しています。  
具体的には、`./amplify/backend/function/amplifyauthsplimitedb1ce0bf7PreSignup/amplifyauthsplimitedb1ce0bf7PreSignup-cloudformation-template.json`の`ALLOWED_EMAIL_REGEX_LIST`を設定しています。  
また、上記で使用する値を`amplify/team-provider-info.json`で指定しています。  

`ALLOWED_EMAIL_REGEX_LIST`環境変数にはSSMのパラメタストアのキーを指定し、`./amplify/backend/function/amplifyauthsplimitedb1ce0bf7PreSignup/src/email-filter-allowlist.ts`で使用しています。  
また、LambdaからSSMにアクセスするために必要な権限を`./amplify/backend/function/amplifyauthsplimitedb1ce0bf7PreSignup/amplifyauthsplimitedb1ce0bf7PreSignup-cloudformation-template.json`に追加しています。  

パラメタを登録するためには以下のコマンドを実行します。  

```shell
aws ssm put-parameter \
  --name "/amplify/<AppId>/<ENV>/AMPLIFY_amplifyauthsplimitedb1ce0bf7PreSignup_ALLOWED_EMAIL_REGEX_LIST" \
  --value "<VALUE>" \
  --type "String" \
  --overwrite

# 例)
aws ssm put-parameter \
  --name "/amplify/d3i10263ngw8cz/dev/AMPLIFY_amplifyauthsplimitedb1ce0bf7PreSignup_ALLOWED_EMAIL_REGEX_LIST" \
  --value ".+@osawa.cloud$" \
  --type "String" \
  --overwrite
```
