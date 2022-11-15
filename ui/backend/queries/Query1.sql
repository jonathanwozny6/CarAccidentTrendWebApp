SELECT EXTRACT(YEAR FROM Date_Time) AS Yr,
       EXTRACT(MONTH FROM Date_Time) AS Mo, 
       EXTRACT(DAY FROM Date_Time) AS D,
       count(*) AS cnt,
       AVG(COUNT(*)) OVER 
          (ORDER BY EXTRACT(YEAR FROM Date_Time) ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) AS moving_average
       
FROM Accident, Road, Location

where fk_street = street and fk_zip_code = zip_code and fk_id_st = id_st and state = 'NY'

GROUP BY EXTRACT(YEAR FROM Date_Time),
         EXTRACT(MONTH FROM Date_Time), 
         EXTRACT(DAY FROM Date_Time)
       
ORDER BY YR, Mo, D ASC
