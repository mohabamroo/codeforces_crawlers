import datetime
print "kololo"
file = open('cron_log.txt', 'w')
line = datetime.datetime.utcnow()
file.write(line)
file.close()

