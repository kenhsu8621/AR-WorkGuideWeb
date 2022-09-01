#!/bin/bash
/media/www &
#find /usr/share/nginx/html -type f -exec sed -i -e "s/default.domain.com/$API_URL/g" {} \;
find /usr/share/nginx/html -type f -exec sed -i -e "s/storage.domain.com/$STORAGE_URL/g" {} \;
echo $SSL_CERT
echo $SSL_PRIVATE
echo -e "$SSL_CERT" | sed 's/ *$//g' >> /etc/nginx/ssl.crt
echo -e "$SSL_PRIVATE" | sed 's/ *$//g' >> /etc/nginx/ssl.key

if grep -q "daemon off;" /etc/nginx/nginx.conf; then
    echo "daemon off; exist!!"
else
    echo "daemon off;" >> /etc/nginx/nginx.conf
fi

nginx -c /etc/nginx/nginx.conf
nginx -s reload
