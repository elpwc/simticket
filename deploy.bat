cd /d C:\node\simticket-project

git pull

call npm install
::call npx prisma db push
call npx prisma generate
call npm run build

pm2 restart simticket