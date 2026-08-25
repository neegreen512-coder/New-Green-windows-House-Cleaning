-- Demonstration content. Organic names + real portrait photos so the reviews
-- section looks alive. The owner can edit or delete all of this from the admin.

DELETE FROM reviews;
DELETE FROM pricing;
DELETE FROM content;

INSERT INTO reviews (name, context, service, quote, rating, status, avatar) VALUES
('Sarah Mitchell', 'Mississauga', 'Window Cleaning', 'The windows look incredible. I did not realise how much light we were missing. Booking was simple, and the team was on time and tidy.', 5, 'approved', '/images/avatars/sarah.jpg'),
('Daniel Okafor', 'Oakville', 'House Cleaning', 'Our home has never felt this fresh. Everything was thought through, right down to the baseboards and the tracks on the patio doors.', 5, 'approved', '/images/avatars/daniel.jpg'),
('Priya Sharma', 'Mississauga', 'Deep Cleaning', 'Booked a deep clean before hosting and it was spotless. The kitchen and bathrooms honestly look brand new. Worth every penny.', 5, 'approved', '/images/avatars/priya.jpg'),
('Marc Tremblay', 'Brampton', 'Window Cleaning', 'Second-storey windows I could never reach are finally clear. Friendly crew, careful around the garden, no streaks at all.', 5, 'approved', '/images/avatars/marc.jpg'),
('Emily Chen', 'Mississauga', 'Deep Cleaning', 'The deep clean reached places I had given up on: behind the appliances, the window tracks, the grout. It felt like a reset for the whole house.', 5, 'approved', '/images/avatars/emily.jpg'),
('Jason Reid', 'Etobicoke', 'House Cleaning', 'Reliable and thorough on our bi-weekly plan. Same standard every visit and easy to reschedule when life gets busy.', 4, 'approved', '/images/avatars/jason.jpg');

INSERT INTO pricing (name, blurb, price, unit, features, featured, sort, active) VALUES
('Window Cleaning', 'Interior and exterior glass done right.', 'From $159', 'per visit', '["Interior + exterior glass","Frames, sills and tracks","Screens on request","Streak-free finish"]', 0, 1, 1),
('House Cleaning', 'Dependable, detailed whole-home cleaning.', 'From $139', 'per visit', '["Kitchens and bathrooms","Dusting and floors","One-time or recurring","Products chosen for your home"]', 1, 2, 1),
('Deep Cleaning', 'A thorough, room-by-room reset.', 'From $299', 'per visit', '["Detailed degrease and descale","Edges, baseboards, corners","Interior window glass","Fixture detailing"]', 0, 3, 1);

INSERT INTO content (key, value) VALUES
('reviews_heading', 'What a great clean feels like.'),
('reviews_intro', 'Real words from the homeowners we clean for.');
