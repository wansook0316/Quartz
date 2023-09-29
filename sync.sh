#!/bin/bash

content_name="content"
vault_name="Wansook.World.Obsidian"

echo "\n ==== 모든 $content_name folder의 내용을 지웁니다. ===="
rm -r "./$content_name"/*

echo "==== $vault_name 의 vault에서 publishing을 원하는 항목만 $content_name folder로 옮깁니다. ===="
obsidian-export "../$vault_name" "./$content_name"

echo "==== $content_name 으로 이동한 항목을 배포합니다. ===="
npx quartz sync