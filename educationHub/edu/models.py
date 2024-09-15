from django.db import models
from django.forms.models import model_to_dict
from sqlalchemy.orm.exc import NoResultFound
from django.contrib.auth.hashers import make_password, check_password
from sqlalchemy.exc import InvalidRequestError, IntegrityError
from django.db.models import Avg


class Students(models.Model):
    """Defines the students table"""
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    email = models.EmailField(max_length=200, unique=True)
    password = models.CharField(max_length=200)

class Teachers(models.Model):
    """Defines teachers table"""
    first_name = models.CharField(max_length=200)
    last_name = models.CharField(max_length=200)
    email = models.EmailField(max_length=200, unique=True)
    subject = models.CharField(max_length=75, null=True, blank=True)
    password = models.CharField(max_length=200)

class Courses(models.Model):
    """Defines the courses table"""
    student_id = models.ForeignKey(Students, on_delete=models.CASCADE)
    name = models.CharField(max_length=150)
    score = models.IntegerField(default=0)

class Tasks(models.Model):
    """defines the tasks table"""
    student_id = models.ForeignKey(Students, on_delete=models.CASCADE)
    created_on = models.DateField(auto_now_add=True)
    course = models.CharField(max_length=70, default=None)
    due_on = models.DateField(default=None, null=True, blank=True)
    accomplished = models.BooleanField(default=False)
    file = models.FileField(upload_to='uploads/tasks', null=True, blank=True)
    graded = models.BooleanField(default=False)
    score = models.IntegerField(default=0)

class Schedule(models.Model):
    """defines schedule class"""
    created_on = models.DateField(auto_now_add=True)
    course_name = models.CharField(max_length=70, default=None)
    link = models.CharField(max_length=300)
    duration = models.IntegerField(default=2)
    time = models.DateTimeField(default=None)

class Resources(models.Model):
    """defines a resource class"""
    
    
class DB_Operations:
    """Performs actions on the database"""
    
    db_models = [Students, Teachers, Courses, Tasks, Schedule]
    available_courses = ['English', 'Chemistry', 'Physics', 'Biology']
    
    def find_object(self, model_name, **kwargs):
        """Returns an instance of the model"""
        if model_name not in self.db_models or model_name is None:
            raise TypeError("Model doesn't exist")
        obj = model_name.objects.filter(**kwargs).first()
        if obj is None:
            raise NoResultFound('Object doesnt exist')
        return obj
    
       
    def create_object(self, model_name, **kwargs):
        """Creates an object based on model"""
        instance_obj = None
        if model_name not in self.db_models or model_name is None:
            raise TypeError("Model doesn't exist")
        else:
            try:
                obj = self.find_object(model_name, **kwargs)
                if obj:
                    raise ValueError(f'{model_name} already exists')
            except IntegrityError as e:
                if 'UNIQUE constraint failed' in str(e):
                    raise ValueError(f'A {model_name} with the name already exists')
                else:
                    raise ValueError(f'{e}')
            except NoResultFound:
                for key, value in kwargs.items():
                    if key == 'password':
                        kwargs[key] = make_password(value)
                try:
                    instance_obj = model_name(**kwargs)
                    instance_obj.save()
                    return instance_obj
                except Exception as e:
                    raise Exception(f'The exception is: {e}')
    
    def update_obj(self, model_name, filter, **kwargs):
        """Updates an object"""
        print('Starting')
        if model_name not in self.db_models or model_name is None:
            raise TypeError("Model doesn't exist")
        fields = [field.name for field in model_name._meta.get_fields()]
        for key, value in kwargs.items():
            if key not in fields:
                raise InvalidRequestError
        try:
            if model_name == Students or model_name == Teachers:
                obj = self.find_object(model_name, email=filter)
            else:
                obj = self.find_object(model_name, student_id=filter)
            for key, value in kwargs.items():
                if key == 'password':
                    value = make_password(value)
                setattr(obj, key, value)
            obj.save()
        except NoResultFound:
            print('raising exception')
            raise NoResultFound('Object does not exist')
        except Exception as e:
            raise
    
    def del_obj(self, model_name, **filter):
        """Deletes an object"""
        if model_name not in self.db_models or model_name is None:
            raise TypeError("Model doesn't exist")
        try:
            obj = self.find_object(model_name, **filter)
            obj.delete()
            return 0
        except NoResultFound:
            raise TypeError('obj doesnt exist')
    
    @staticmethod
    def get_all(model_name):
        """Retreives all model objects"""
        if model_name not in [Students, Teachers, Courses, Tasks, Schedule] or model_name is None:
            raise TypeError("Model doesn't exist")
        objs = [model_to_dict(obj) for obj in model_name.objects.all()]
        return objs
    
    def get_registeredCourses(self, student_id):
        """Gets all the courses a student has registered to"""
        try:
            objs = list(model_to_dict(obj) for obj in Courses.objects.all().filter(student_id=student_id))
            return objs
        except NoResultFound:
            raise ValueError('Unauthorized User')
        
    def is_valid(self, model_name, password, **filters):
        """Validates a users credentials"""
        try:
            obj = self.find_object(model_name, **filters)
            if check_password(password, obj.password):
                return True
            else:
                return False
        except NoResultFound:
            raise ValueError('No user matches the credentials')
        except Exception as e:
            raise TypeError(f'{e}')
    
    def get_students_by_course(self, coursename):
        """Gets all students based on their registered courses"""
        temp = [model_to_dict(obj) for obj in Courses.objects.all().filter(name=coursename)]
        print(temp)
        students = [student['student_id'] for student in temp]
        ls = []
        for std in students:
            stud = self.find_object(Students, id=std)
            ls.append(model_to_dict(stud))
        return ls
    
    def delete_all(self, model_name):
        #deletes all objects based on the model name
        model_name.objects.all().delete()
        return 1
    
    def get_average_score(self, student, course_name):
        """Gets the average score of a course for a specific student."""
        result = Tasks.objects.filter(student_id=student, course=course_name).aggregate(average_score=Avg('score'))
        average_score = result.get('average_score') or 0
        return average_score