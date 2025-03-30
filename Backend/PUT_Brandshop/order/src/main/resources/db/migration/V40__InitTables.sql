CREATE TABLE deliver
(
    id serial primary key,
    uuid varchar not null,
    name varchar not null,
    price decimal not null,
    image_url varchar not null
);

CREATE TABLE payment
(
    id serial primary key,
    uuid varchar not null,
    name varchar not null,
    image_url varchar not null
);

CREATE TABLE orders
(
    id serial primary key,
    uuid varchar not null,
    orders varchar not null,
    status varchar not null,
    firstname varchar not null,
    lastname varchar not null,
    phone varchar not null,
    email varchar not null,
    city varchar not null,
    street varchar not null,
    number varchar not null,
    postcode varchar not null,
    client  varchar,
    deliver integer REFERENCES "deliver" (id),
    payment integer REFERENCES "payment" (id)
);

CREATE TABLE order_items
(
    id serial primary key,
    uuid varchar not null,
    name varchar not null,
    product varchar not null,
    priceunit decimal DEFAULT 0,
    pricesummary decimal DEFAULT 0,
    quantity bigint DEFAULT 1,
    orders bigint REFERENCES orders(id)
);

insert into deliver values (1, 'DPD', 'Kurier DPD',14.90,'https://www.dpd.com/wp-content/themes/DPD_NoLogin/images/DPD_logo_redgrad_rgb_responsive.svg');
insert into deliver values (2, 'InPost', 'Kurier InPost',12.90,'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/InPost_logo.svg/640px-InPost_logo.svg.png');
insert into deliver values (3, 'Odbior', 'Odbiór osobisty',0.00,'https://soczewkujemy.pl/upload/soczewkujemy/images//odbior-osobisty.png');

insert into payment values (1, 'PAYU', 'PayU','https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/PayU.svg/2560px-PayU.svg.png');
insert into payment values (2, 'ODBIOR', 'Przy odbiorze','https://e1.pngegg.com/pngimages/514/115/png-clipart-icone-de-tresorerie-argent-paiement-finances-conception-d-icone-banque-impot-carte-de-debit.png');