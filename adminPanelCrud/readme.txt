use adminPaneldb
db.createUser({user: "adminPaneldb",pwd: "adminPaneldb",roles: ["readWrite","dbAdmin"]})