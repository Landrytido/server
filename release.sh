
ssh hdm "cd projects/infra/applications/mywebcompanion-new/backend/www";
rsync -zarvvhd --exclude bundles --exclude var --exclude .data --exclude .scss --exclude vendor --exclude *.xcf --exclude dist --exclude .env --exclude .git --exclude .idea  --exclude cache --exclude *.sql* --exclude *.rar --exclude ssl --exclude node_modules ./* hdm:projects/infra/applications/mywebcompanion-new/backend/www
ssh hdm;
