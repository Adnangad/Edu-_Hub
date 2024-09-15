from django.http import HttpResponse, JsonResponse, Http404
from .models import *
from dotenv import load_dotenv
from django.utils.timezone import now
from django.db.models import F
import os
from datetime import datetime, timedelta
import json
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from sqlalchemy.orm.exc import NoResultFound
from django.forms.models import model_to_dict
from django.core.cache import cache
from uuid import uuid4
from .models import Tasks

db_op = DB_Operations()
available_courses = ['Math', 'English', 'Chemistry', 'Biology', 'Physics']

load_dotenv()
def index(request):
    """Testing if it works"""
    return HttpResponse('It works')

@csrf_exempt
def signUp(request):
    """Adds a user to the db"""
    otps = ['hello', 'ab', 'cd']
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
            first_name = data.get('first_name')
            last_name = data.get('last_name')
            model_name = data.get('type')
            email = data.get('email')
            password = data.get('password')
            course = data.get('subject')
            otp = data.get('otp')
            print(otp)
            token = uuid4()
            if model_name == 'Teachers':
                if otp not in otps:
                    return JsonResponse({'error': 'Wrong OTP'}, status=401)
                obj = db_op.create_object(Teachers, first_name=first_name, last_name=last_name, email=email, password=password, subject=course)
            elif model_name == 'Students':
                obj = db_op.create_object(Students, first_name=first_name, last_name=last_name, email=email, password=password)
            else:
                return JsonResponse({'error': 'Invalid model name'}, status=400)
            cache.set(f'auth_{token}', obj.email, 86400)
            user_dict = model_to_dict(obj)
            subject = 'Signed Up to EDU Hub'
            message = f'Dear {first_name}, welcome to EDU Hub'
            email_from = os.getenv('DEFAULT_FROM_EMAIL')
            recipient = [email]
            send_mail(subject, message, email_from, recipient)
            return JsonResponse({'user': user_dict, 'token': token}, safe=False)
                
        except ValueError as e:
            return JsonResponse({'error': f'Invalid data: {str(e)}'}, status=400)
        
        except IntegrityError:
            return JsonResponse({'error': f'A user with email {email} already exists'}, status=400)
        
        except Exception as e:
            return JsonResponse({'error': f'An error occurred: {str(e)}'}, status=500)

@csrf_exempt
def login(request):
    """Logs in a user"""
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        model_name = data.get('type')
        email = data.get('email')
        password = data.get('password')
        token = uuid4()
        try:
            if model_name == 'Students':
                value = db_op.is_valid(Students, password, email=email)
                print(value)
                obj = db_op.find_object(Students, email=email)
            elif model_name == 'Teachers':
                value = db_op.is_valid(Teachers, password, email=email)
                obj = db_op.find_object(Teachers, email=email)
            else:
                return JsonResponse({'error': 'Invalid model name'}, status=400)

            if value is True:
                auth = f'auth_{token}'
                print(auth)
                cache.set(auth, obj.email, 86400)
                print(f'auth token is {auth}')
                obj = model_to_dict(obj)
                return JsonResponse({'message': 'You have successfully logged in', 'user': obj, 'token': token}, safe=False)
            else:
                return JsonResponse({'error': 'Wrong password'}, status=401)
        except ValueError as e:
            return JsonResponse({'error': f'{e}'}, status=400)
        except Exception as e:
            return JsonResponse({'error': f'{e}'}, status=404)
    
def logout(request):
    """Deletes users session"""
    token = request.headers['X-Token']
    user_auth = cache.get(f'auth_{token}')
    if user_auth:
        cache.delete(f'auth_{token}')
        return JsonResponse({}, status=200, safe=False)
    else:
        return JsonResponse({'error': 'Unable to log out'}, status=404, safe=False)


def getStudents(request):
    """Retrieves all students"""
    if request.method == 'GET':
        try:
            token = request.headers['X-Token']
            print(token)
        except Exception as e:
            return JsonResponse({'error': e})
        user_auth = cache.get(f'auth_{token}')
        print(user_auth)
        if user_auth:
            try:
                objs = db_op.get_all(Students)
                return JsonResponse({'Students': objs}, safe=False)
            except TypeError:
                return JsonResponse({'error': 'Type doesnt exist'}, status=400)
        else:
            return JsonResponse({"error": 'unauthorized, please log in'}, status=401)

def offered(request):
    """Retreives a  list of offered courses"""
    if request.method == 'GET':
        token = request.headers['X-Token']
        user_auth = cache.get(f'auth_{token}')
        if user_auth:
            return JsonResponse({'Courses': available_courses}, safe=False)
        else:
            return JsonResponse({"error": 'unauthorized, please log in'}, status=401)
    else:
        return JsonResponse({"error": 'Invalid request method'}, status=404)                
    

def getTeachers(request):
    """Retrieves all teachers"""
    if request.method == 'GET':
        token = request.headers['X-Token']
        user_auth = cache.get(f'auth_{token}')
        if user_auth:
            try:
                objs = db_op.get_all(Teachers)
                return JsonResponse({'Teachers': objs}, safe=False)
            except TypeError:
                return JsonResponse({'error': 'Type doesnt exist'}, status=400)
        else:
            return JsonResponse({"error": 'unauthorized, please log in'}, status=401)

def getCourses(request):
    """Gets al the courses the student has registered for"""
    token = request.headers['X-Token']
    user_auth = cache.get(f'auth_{token}')
    print(f'token is {token}')
    if request.method == 'GET':
        if user_auth:
            try:
                user = db_op.find_object(Students, email=user_auth)
                print(user)
                user_id = user.id                
                registered_courses = db_op.get_registeredCourses(user_id)
                objs = registered_courses
                return JsonResponse(objs, safe=False)
            except Exception as e:
                return JsonResponse({'error': e}, status=400)
        return JsonResponse({"error": 'unauthorized, please login'}, status=401)        
                

@csrf_exempt
def registerCourse(request):
    """Registers a user to a course"""
    token = request.headers['X-Token']
    user_auth = cache.get(f'auth_{token}')
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        course = data.get('course')
        print(course)
        if user_auth:
            try:
                user = db_op.find_object(Students, email=user_auth)
                print(user.id)
                try:
                    if course not in available_courses:
                        return JsonResponse({'error': 'We are yet to offer that course'}, status=404)
                    registercourse = db_op.create_object(Courses, student_id=user, name=course, score=0)
                except Exception as e:
                    return JsonResponse({'error': e}, status=400)
                course_dict = model_to_dict(registercourse)
                print(course_dict)
                return JsonResponse(course_dict, safe=False)
            except Exception as e:
                return JsonResponse({'error': e}, status=400)
        else:
            return JsonResponse({'error': 'Please login to continue'}, status=401)

@csrf_exempt
def deregister(request):
    """Deregisters a user from a course"""
    token = request.headers['X-Token']
    user_auth = cache.get(f'auth_{token}')
    if request.method == 'DELETE':
        data = json.loads(request.body.decode('utf-8'))
        course = data.get('course')
        if user_auth:
            try:
                user = db_op.find_object(Students, email=user_auth)
                print(user.id)
                try:
                    print('dereg beggining')
                    registercourse = db_op.del_obj(Courses, student_id=user, name=course)
                    if registercourse == 0:
                        return JsonResponse({'message': 'You have been removed from the subjects registry'}, safe=False, status=200)
                except Exception as e:
                    return JsonResponse({'error': e}, status=400)
            except Exception as e:
                return JsonResponse({'error': e}, status=400)
        else:
            return JsonResponse({'error': 'Please login to continue'}, status=401)

@csrf_exempt
def update_account(request):
    """Updates a users account"""
    if request.method == 'PUT':
        token = request.headers.get('X-Token')
        auth = cache.get(f'auth_{token}')
        if auth:
            data = json.loads(request.body.decode('utf-8'))
            model_type = data.get('type')
            email = data.get('email')
            print(email)
            password = data.get('old_password')
            if model_type == 'Students':
                try:
                    if db_op.is_valid(Students, password, email=email) is False:
                        return JsonResponse({'error': 'Invalid user/password'}, status=401)
                except Exception as e:
                    return JsonResponse({'error': str(e)}, status=404, safe=False)
                try:
                    obj = db_op.find_object(Students, email=email)
                    for key, value in data.items():
                        if key not in ['email', 'type', 'old_password']:
                            setattr(obj, key, value)
                    obj.save()
                    return JsonResponse({'message': 'Success'}, status=200)
                except NoResultFound as e:
                    return JsonResponse({'error': str(e)}, status=404, safe=False)
            if model_type == 'Teachers':
                if db_op.is_valid(Teachers, password, email=email) is False:
                    return JsonResponse({'error': 'Invalid user/password'}, status=401)
                try:
                    obj = db_op.find_object(Teachers, email=email)
                    for key, value in data.items():
                        if key not in ['email', 'old_password', 'type']:
                            setattr(obj, key, value)
                    obj.save()
                    return JsonResponse({'message': 'Success'}, status=200)
                except Exception as e:
                    return JsonResponse({'error': str(e)}, status=404, safe=False)
        else:
            return JsonResponse({'error': 'Unauthorized'}, status=401)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)
         

@csrf_exempt
def upload(request):
    """Creates an assignment"""
    if request.method == 'POST':
        token = request.headers.get('X-Token')
        auth = cache.get(f'auth_{token}')
        if auth:
            try:
                teacher = db_op.find_object(Teachers, email=auth)
                course = teacher.subject
                due_on = request.POST.get('due') or None
                accomplished = False
                graded = False
                file = request.FILES.get('file')
                print(f'course: {course}, due_on:{due_on}')
                std_ids = db_op.get_students_by_course(course)
                        
                if not file:
                    return JsonResponse({'error': 'No file provided'}, status=400)
                print(f'due on real datte: {due_on}')
                for student in std_ids:
                    try:
                        std = db_op.find_object(Students, id=student['id'])
                        task = Tasks(student_id=std, course=course, due_on=due_on, accomplished=accomplished, file=file, graded=graded)
                        task.save()
                    except Exception as e:
                        print(f'Error in the loop is: {e}')
                        raise e
                print('hello')
                print(db_op.get_all(Tasks))            
                return JsonResponse({'message': 'Success'}, status=200)
        
            except Exception as e:
                print(f'error is {e}')
                return JsonResponse({'error': str(e)}, status=500)
        else:
            return JsonResponse({'error': 'Unauthorized'}, status=401)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def setMeeting(request):
    #gets meeting info from teachers site
    if request.method == 'POST':
        token = request.headers.get('X-Token')
        auth = cache.get(f'auth_{token}')
        if auth:
            data = json.loads(request.body.decode('utf-8'))
            link = data.get('link')
            time = data.get('date')
            duration = data.get('duration')
            course = data.get('course')
            meeting = Schedule(link=link, time=time, course_name=course, duration=duration)
            meeting.save()
            return JsonResponse({'message': 'SUccess'}, status=200)
        else:
            return JsonResponse({'error': 'Unauthorized'}, status=401)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

def getmeeting(request):
    if request.method == 'GET':
        token = request.headers.get('X-Token')
        auth = cache.get(f'auth_{token}')
        if auth:
            current = now()
            schedules_to_delete = Schedule.objects.filter(time__lt=current - timedelta(hours=2))
            schedules_to_delete.delete()
            schedule = [model_to_dict(obj) for obj in Schedule.objects.all()]
            print(schedule)
            print(type(schedule))
            return JsonResponse({'schedule': schedule}, status=200, safe=False)
        else:
            return JsonResponse({'error': 'Unauthorized'}, status=401)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)    

def get_tasks(request):
    """retrieves the students tasks"""
    if request.method == 'GET':
        token = request.headers.get('X-Token')
        auth = cache.get(f'auth_{token}')
        if not auth:
            return JsonResponse({'error': 'Unauthorized'}, status=401)
        student = db_op.find_object(Students, email=auth)
        registered_courses = db_op.get_registeredCourses(student)
        if not registered_courses:
            return JsonResponse({'projects': []}, status=200, safe=False)
        projects = []
        for course in registered_courses:
            course_name = course.get('name')
            tasks = Tasks.objects.filter(course=course_name, accomplished=False, graded=False)
            try:
                for task in tasks:
                    print(task.id)
                    due = task.due_on
                    download_url = request.build_absolute_uri(f'/edu/download_file/{task.id}')
                    file_url = task.file.url
                    print(file_url)
                    projects.append({'course': course_name, 'download_url': download_url, 'due_on': due, 'task_id': task.id})
            except Tasks.DoesNotExist:
                continue
            except Exception as e:
                print(f'Error is {e}')
                raise e
        print(projects)
        return JsonResponse({'projects': projects}, status=200, safe=False)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def get_projects(request):
    """Retreives the students projects for marking"""
    if request.method == 'GET':
        token = request.headers.get('X-Token')
        auth = cache.get(f'auth_{token}')
        
        if not auth:
            return JsonResponse({'error': 'Unauthorized'}, status=401)
        teacher = db_op.find_object(Teachers, email=auth)
        ungraded_projects = []
        try:
            tasks = Tasks.objects.filter(course=teacher.subject, accomplished=True, graded=False)
            print(tasks)
            for task in tasks:
                students = model_to_dict(task.student_id)
                download_url = request.build_absolute_uri(f'/edu/download_file/{task.id}')
                file_url = task.file.url
                ungraded_projects.append({'course': teacher.subject, 'download_url': download_url, 'students_id': students['id'], 'task_id': task.id})
        except Tasks.DoesNotExist:
            return JsonResponse({'ungraded_projects': []}, status=200, safe=False)
        except Exception as e:
            raise e
        print(ungraded_projects)
        return JsonResponse({'ungraded_projects': ungraded_projects}, status=200, safe=False)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)


                
def download_file(request, task_id):
    """Download link for a file"""
    try:
        task  = Tasks.objects.get(pk=task_id)
        file_path = task.file.path
        if not os.path.exists(file_path):
            raise Http404
        with open(file_path, 'rb') as file:
            response = HttpResponse(file.read(), content_type='application/octet-stream')
            response['Content-Disposition'] = f'attachment; filename="{os.path.basename(file_path)}"'
            return response
    except Tasks.DoesNotExist:
        raise Http404('file does not exist')

@csrf_exempt
def submitproject(request):
    """Retrieves the submitted project from the student"""
    if request.method == 'POST':
        token = request.headers.get('X-Token')
        auth = cache.get(f'auth_{token}')
        
        if auth:
            try:
                course = request.POST.get('course')
                due_on = request.POST.get('due') or None
                task_id = request.POST.get('project_id')
                accomplished = True
                graded = False
                file = request.FILES.get('file')
                
                if not course:
                    return JsonResponse({'error': 'Course is required'}, status=400)
                
                if not task_id:
                    return JsonResponse({'error': 'Task ID is required'}, status=400)
                
                student = db_op.find_object(Students, email=auth)

                if not file:
                    return JsonResponse({'error': 'No file provided'}, status=400)
                
                try:
                    task = Tasks.objects.get(student_id=student, course=course, id=task_id)
                    task.due_on = due_on
                    task.file = file
                    task.accomplished = accomplished
                    task.graded = graded
                    task.save()
                    
                    print(f"File saved at: {task.file.path}")
                    return JsonResponse({'message': 'Success'}, status=200)
                except Tasks.DoesNotExist:
                    return JsonResponse({'error': 'Task does not exist'}, status=404)
            except Exception as e:
                print(f'Error: {e}')
                return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def gradeproject(request):
    """Grades a students assignment"""
    if request.method == 'POST':
        print('Starting')
        token = request.headers.get('X-Token')
        print(token)
        auth = cache.get(f'auth_{token}')
        print(auth)     
        if not auth:
            return JsonResponse({'error': 'Unauthorized'}, status=401)
        teacher = db_op.find_object(Teachers, email=auth)
        try:
            student_id = request.POST.get('student_id')
            project_id = request.POST.get('project_id')
            score = request.POST.get('score')
            file = request.FILES.get('file')
            print(f'Student id is {student_id}')
            student = db_op.find_object(Students, id=student_id)
            print(student)
            task = Tasks.objects.get(course=teacher.subject, accomplished=True, graded=False, id=project_id, student_id=student)
            print(task.course)
            task.score = score
            task.graded = True
            task.file = file
            task.save()
            average_score = db_op.get_average_score(student, teacher.subject)
            print(average_score)
            course = Courses.objects.get(student_id=student, name=teacher.subject)
            print(f'Course is {course}')
            course.score = average_score
            course.save()
            return JsonResponse({'message': 'Success'}, status=200)
        except Tasks.DoesNotExist:
            return JsonResponse({'ungraded_projects': []}, status=200, safe=False)
        except Exception as e:
            print(f'error is:{e}')
            raise e    
    return JsonResponse({'error': 'Invalid request method'}, status=405)