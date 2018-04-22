from crontab import CronTab

cron = CronTab(tab="""* * * * * command""")  
job = cron.new(command='python cfuu.py')  
job.minute.every(.1)

cron.write()  