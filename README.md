Remote Hosting Provider Projekt

Zawiera system z rejestrowaniem I logowaniem utrzymywane w bazie danych na silniku MSSQL

Aby zkonfigurowac baze trzeba stworzyc login I baze danych z tabela users:
(

    Id Int IDENTITY(1,1) PRIMARY KEY NOT NULL,
    Usernm VARCHAR(255) NOT NULL,
    Passwd VARCHAR(255) NOT NULL

)

Dodatkowo trzeba wlaczyc TCP/IP w Server Configuration Manager w Protocols for MSSQLSERVER I zrestartowac SQL Server

Film bedzie dodany pozniej