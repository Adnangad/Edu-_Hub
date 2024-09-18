from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("signUp", views.signUp, name="signUp"),
    path("getStudents", views.getStudents, name="getStudents"),
    path("getTeachers", views.getTeachers, name="getTeachers"),
    path("login", views.login, name="login"),
    path("logout", views.logout, name="logout"),
    path("getCourses", views.getCourses, name="getCourses"),
    path("registerCourse", views.registerCourse, name='registerCourse'),
    path("upload", views.upload, name='upload'),
    path("deregister", views.deregister, name='deregister'),
    path("offered", views.offered, name='offered'),
    path("update_account", views.update_account, name='update_account'),
    path("setmeeting", views.setMeeting, name='setmeeting'),
    path("getmeeting", views.getmeeting, name='getmeeting'),
    path("get_projects", views.get_projects, name='get_projects'),
    path("getTasks", views.get_tasks, name='getTasks'),
    path('download_file/<int:task_id>/', views.download_file, name='download_file'),
    path("submitproject", views.submitproject, name='submitproject'),
    path("gradeproject", views.gradeproject, name="gradeproject"),
    path("setresource", views.setresource, name='setresource'),
    path("getresource", views.getresource, name='getresource'),
    path("getgraded", views.getgraded, name="getgraded"),
    path("chatRoom", views.chatRoom, name="chatRoom"),
    path("profile", views.profile, name="profile"),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)