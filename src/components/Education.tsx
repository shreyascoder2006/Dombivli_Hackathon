import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { useApp } from '../App';
import { 
  BookOpen, 
  Play, 
  Clock, 
  Users, 
  Award, 
  TrendingUp,
  Brain,
  Target,
  Lightbulb,
  FileText,
  Video,
  Headphones,
  CheckCircle,
  Lock,
  Star
} from 'lucide-react';



const tutorials = [
  {
    title: 'Building Your First RSI Strategy',
    type: 'video',
    duration: '15 min',
    difficulty: 'Beginner',
    views: 15420,
    likes: 892
  },
  {
    title: 'Understanding Moving Average Crossovers',
    type: 'article',
    duration: '8 min',
    difficulty: 'Beginner',
    views: 12350,
    likes: 654
  },
  {
    title: 'Advanced Backtesting Techniques',
    type: 'video',
    duration: '25 min',
    difficulty: 'Advanced',
    views: 8930,
    likes: 543
  },
  {
    title: 'Risk Management Best Practices',
    type: 'article',
    duration: '12 min',
    difficulty: 'Intermediate',
    views: 11240,
    likes: 723
  },
  {
    title: 'Market Regime Detection with AI',
    type: 'podcast',
    duration: '45 min',
    difficulty: 'Advanced',
    views: 6780,
    likes: 421
  }
];

const webinars = [
  {
    title: 'Live Trading Session: Market Analysis',
    date: 'Today, 2:00 PM EST',
    presenter: 'Alex Morgan',
    attendees: 234,
    status: 'live'
  },
  {
    title: 'Q&A: Common Strategy Mistakes',
    date: 'Tomorrow, 4:00 PM EST',
    presenter: 'Sarah Chen',
    attendees: 156,
    status: 'upcoming'
  },
  {
    title: 'Advanced Options Strategies',
    date: 'Friday, 1:00 PM EST',
    presenter: 'David Kumar',
    attendees: 89,
    status: 'upcoming'
  }
];

const achievements = [
  { name: 'First Strategy', description: 'Created your first trading strategy', earned: true },
  { name: 'Backtest Master', description: 'Completed 10 backtests', earned: true },
  { name: 'Risk Aware', description: 'Completed risk management course', earned: false },
  { name: 'Community Helper', description: 'Helped 5 community members', earned: false },
  { name: 'Profitable Trader', description: 'Achieved 10% returns', earned: true },
  { name: 'Course Graduate', description: 'Completed 3 courses', earned: false }
];

export function Education() {
  const { courses, setCourses, enrolledCourses, setEnrolledCourses } = useApp();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseDetail, setShowCourseDetail] = useState(false);

  const enrollInCourse = (courseId: string) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses([...enrolledCourses, courseId]);
      toast.success('Successfully enrolled in course!');
    } else {
      toast.info('You are already enrolled in this course');
    }
  };

  const startLesson = (courseId: string, lessonId: number) => {
    const updatedCourses = courses.map(course => {
      if (course.id === courseId) {
        const updatedContent = course.content.map(lesson => {
          if (lesson.id === lessonId) {
            return { ...lesson, completed: true };
          }
          return lesson;
        });
        return { ...course, content: updatedContent };
      }
      return course;
    });
    setCourses(updatedCourses);
    toast.success('Lesson completed!');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Trading Education Hub</h1>
          <p className="text-muted-foreground">Master algorithmic trading with courses, tutorials, and live sessions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Award className="h-4 w-4 mr-2" />
            My Progress
          </Button>
          <Button size="sm">
            <Play className="h-4 w-4 mr-2" />
            Continue Learning
          </Button>
        </div>
      </div>

      {/* Learning Path Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900">Your Learning Journey</CardTitle>
              <CardDescription className="text-blue-700">
                Structured path from beginner to advanced trader
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl text-blue-900">42%</div>
              <div className="text-sm text-blue-700">Complete</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress value={42} className="h-2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <h4 className="text-sm">Foundations</h4>
                  <p className="text-xs text-muted-foreground">Completed</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Play className="h-8 w-8 text-blue-500" />
                <div>
                  <h4 className="text-sm">Strategy Building</h4>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                <Lock className="h-8 w-8 text-gray-400" />
                <div>
                  <h4 className="text-sm">Advanced Topics</h4>
                  <p className="text-xs text-muted-foreground">Locked</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="webinars">Live Sessions</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2>Featured Courses</h2>
            <Button variant="outline" size="sm">View All Courses</Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className={`hover:shadow-lg transition-shadow ${course.featured ? 'ring-2 ring-blue-200' : ''}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">{course.description}</p>
                    </div>
                    {course.featured && (
                      <Badge className="bg-blue-100 text-blue-800">Featured</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {course.lessons} lessons
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {course.enrolled}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant={course.level === 'Beginner' ? 'default' : 
                               course.level === 'Intermediate' ? 'secondary' : 'destructive'}
                    >
                      {course.level}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{course.rating}</span>
                    </div>
                    <span className="text-sm">by {course.instructor}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {course.topics.map((topic, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                  
                  {course.progress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xl">
                      {course.price === 0 ? 'Free' : `${course.price}`}
                    </span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm"
                          onClick={() => setSelectedCourse(course)}
                        >
                          {enrolledCourses.includes(course.id) ? 'Continue' : course.price === 0 ? 'Start Free' : 'Enroll Now'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{course.title}</DialogTitle>
                          <DialogDescription>{course.description}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Badge variant="outline">{course.level}</Badge>
                            <span className="text-sm flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {course.duration}
                            </span>
                            <span className="text-sm flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              {course.lessons} lessons
                            </span>
                          </div>
                          
                          {course.content && course.content.length > 0 && (
                            <div className="space-y-2">
                              <h4>Course Content:</h4>
                              <div className="space-y-2 max-h-48 overflow-y-auto">
                                {course.content.map((lesson) => (
                                  <div key={lesson.id} className="flex items-center justify-between p-2 border rounded">
                                    <div className="flex items-center gap-2">
                                      {lesson.completed ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <Play className="h-4 w-4 text-blue-500" />
                                      )}
                                      <span className="text-sm">{lesson.title}</span>
                                      <span className="text-xs text-muted-foreground">({lesson.duration})</span>
                                    </div>
                                    {enrolledCourses.includes(course.id) && (
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => startLesson(course.id, lesson.id)}
                                        disabled={lesson.completed}
                                      >
                                        {lesson.completed ? 'Completed' : 'Start'}
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between pt-4">
                            <span className="text-xl">
                              {course.price === 0 ? 'Free' : `${course.price}`}
                            </span>
                            {!enrolledCourses.includes(course.id) && (
                              <Button onClick={() => enrollInCourse(course.id)}>
                                {course.price === 0 ? 'Enroll Free' : 'Enroll Now'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tutorials" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2>Latest Tutorials</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Filter</Button>
              <Button variant="outline" size="sm">Sort</Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {tutorials.map((tutorial, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100">
                        {tutorial.type === 'video' && <Video className="h-6 w-6 text-blue-600" />}
                        {tutorial.type === 'article' && <FileText className="h-6 w-6 text-blue-600" />}
                        {tutorial.type === 'podcast' && <Headphones className="h-6 w-6 text-blue-600" />}
                      </div>
                      <div>
                        <h3 className="text-lg">{tutorial.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{tutorial.duration}</span>
                          <Badge variant="outline">{tutorial.difficulty}</Badge>
                          <span>{tutorial.views.toLocaleString()} views</span>
                          <span>{tutorial.likes} likes</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => {
                        toast.success(`Opening ${tutorial.title}...`);
                        // Simulate opening tutorial
                        setTimeout(() => {
                          toast.info(`${tutorial.type === 'video' ? 'Video' : tutorial.type === 'article' ? 'Article' : 'Podcast'} completed!`);
                        }, 2000);
                      }}
                    >
                      {tutorial.type === 'video' ? 'Watch' : tutorial.type === 'article' ? 'Read' : 'Listen'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webinars" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2>Live Trading Sessions & Webinars</h2>
            <Button size="sm">Schedule a Session</Button>
          </div>
          
          <div className="space-y-4">
            {webinars.map((webinar, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg">{webinar.title}</h3>
                        {webinar.status === 'live' && (
                          <Badge className="bg-red-100 text-red-800">🔴 Live</Badge>
                        )}
                        {webinar.status === 'upcoming' && (
                          <Badge variant="outline">Upcoming</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{webinar.date}</span>
                        <span>by {webinar.presenter}</span>
                        <span>{webinar.attendees} attending</span>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant={webinar.status === 'live' ? 'default' : 'outline'}
                      onClick={() => {
                        if (webinar.status === 'live') {
                          toast.success('Joining live session...');
                          setTimeout(() => {
                            toast.info('Connected to live session!');
                          }, 1500);
                        } else {
                          toast.success('Successfully registered for webinar!');
                        }
                      }}
                    >
                      {webinar.status === 'live' ? 'Join Now' : 'Register'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Upcoming Schedule</CardTitle>
              <CardDescription>Weekly educational sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <p className="text-sm">Monday - Market Analysis</p>
                    <p className="text-xs text-muted-foreground">9:00 AM EST</p>
                  </div>
                  <Badge variant="outline">Weekly</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <p className="text-sm">Wednesday - Strategy Reviews</p>
                    <p className="text-xs text-muted-foreground">2:00 PM EST</p>
                  </div>
                  <Badge variant="outline">Weekly</Badge>
                </div>
                <div className="flex justify-between items-center p-3 border rounded">
                  <div>
                    <p className="text-sm">Friday - Q&A Session</p>
                    <p className="text-xs text-muted-foreground">4:00 PM EST</p>
                  </div>
                  <Badge variant="outline">Weekly</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2>Your Achievements</h2>
              <div className="text-sm text-muted-foreground">
                3 of 6 earned
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <Card key={index} className={`${achievement.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                  <CardContent className="p-4 text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                      achievement.earned ? 'bg-green-100' : 'bg-gray-200'
                    }`}>
                      {achievement.earned ? (
                        <Award className="h-8 w-8 text-green-600" />
                      ) : (
                        <Lock className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <h3 className={`text-sm mb-1 ${achievement.earned ? 'text-green-900' : 'text-gray-600'}`}>
                      {achievement.name}
                    </h3>
                    <p className={`text-xs ${achievement.earned ? 'text-green-700' : 'text-gray-500'}`}>
                      {achievement.description}
                    </p>
                    {achievement.earned && (
                      <Badge className="mt-2 bg-green-100 text-green-800">Earned</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Learning Stats</CardTitle>
                <CardDescription>Your educational progress overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl text-blue-600">2</div>
                    <div className="text-sm text-muted-foreground">Courses Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl text-green-600">18</div>
                    <div className="text-sm text-muted-foreground">Hours Learned</div>
                  </div>
                  <div>
                    <div className="text-2xl text-purple-600">12</div>
                    <div className="text-sm text-muted-foreground">Tutorials Watched</div>
                  </div>
                  <div>
                    <div className="text-2xl text-orange-600">5</div>
                    <div className="text-sm text-muted-foreground">Live Sessions Attended</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}