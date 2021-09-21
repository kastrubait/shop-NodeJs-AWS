insert into 
  products (id, title, description, price, image) 
values
  (
    "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
    "Steering cardan",
    "(analog) (A) vendor code (50-3401060)",
    12.4,
    "steering-cardan.jpg"
  ),
  (
    "01609b61-13ab-41d6-9c35-c69d84a4f442",
    "Cardan",
    "(A) vendor code (85-3401150)",
    14.51,
    "cardan.jpg"
  ),
  (
    "67a7dc17-ca26-4700-9aba-855a7efa307d",
    "Hydraulic cylinder",
    "vendor code (50-3405015)",
    10,
    "hydraulic-cylinder.jpg"
  ),
  (
    "50719c95-00af-431e-bee1-f51e94b2d032",
    "Power steering",
    "vendor code (70-3400020)",
    40,
    "power-steering.jpg"
  ),
  (
    "1646311e-7cfb-4134-82fb-041aa0a5deab",
    "Hydrodistributor GUR",
    "vendor code (50-3406015A)",
    139.91,
    "hydrodistributor.jpg"
  ),
  (
    "5ca9f2d9-48fe-4b13-bd02-75c038fae609",
    "Hydraulic tank GUR MTZ",
    "With filter, with bracket for metering pump. vendor code (70-3400020-03 HEADS)",
    256.31,
    "hydraulic-tank.jpg"
  ),
  (
    "f8a2021c-40fa-4db6-9a1f-17f27ea8fe1b",
    "Finger",
    "vendor code (102-3405103 ZI)",
    30.05,
    "finger.jpg"
  )

insert into
    stocks (product_id, count)
values
    ('7567ec4b-b10c-48c5-9345-fc73c48a80aa', 14),
    ('01609b61-13ab-41d6-9c35-c69d84a4f442', 30),
    ('67a7dc17-ca26-4700-9aba-855a7efa307d', 6),
    ('50719c95-00af-431e-bee1-f51e94b2d032', 15),
    ('1646311e-7cfb-4134-82fb-041aa0a5deab', 12),
    ('5ca9f2d9-48fe-4b13-bd02-75c038fae609', 13),
    ('f8a2021c-40fa-4db6-9a1f-17f27ea8fe1b', 20);