from datetime import datetime, timedelta
now = datetime.now()

rez = now + timedelta(days=-2, hours=-3)
if rez < datetime.now():
    print('yes')
else:
    print('no')