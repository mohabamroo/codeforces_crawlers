from crontab import CronTab
# cron = CronTab('root')
cron = CronTab(tab="""
  * * * * * command
""")
job = cron.new(command='python test.py')  
job.minute.every(1)
job.enable()
print job.is_valid()
print job.is_enabled()
cron.write()  