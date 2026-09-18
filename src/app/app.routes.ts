import { Routes } from '@angular/router';
import { LessonPage } from './features/classroom/pages/lesson-page/lesson-page';
import { LessonRedirectPage } from './features/classroom/pages/lesson-redirect-page/lesson-redirect-page';
import { HomePage } from './features/home/pages/home-page/home-page';

export const routes: Routes = [
  { path: '', component: HomePage, title: 'Learn — small AWS lessons' },
  { path: 'lesson/:lessonId', component: LessonRedirectPage },
  {
    path: 'lesson/:lessonId/:stepId',
    component: LessonPage,
    title: 'Lesson — Learn',
  },
];
