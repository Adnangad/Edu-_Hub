import pusher
from dotenv import load_dotenv
import os

load_dotenv()
pusher_client = pusher.Pusher(
  app_id=os.getenv('PUSHER_APP_APP_ID'),
  key=os.getenv('REACT_APP_API_KEY'),
  secret= os.getenv('PUSHER_APP_SECRET'),
  cluster=os.getenv('REACT_APP_CLUSTER'),
  ssl=True
)

pusher_client.trigger('my-channel', 'my-event', {'message': 'hello world'})