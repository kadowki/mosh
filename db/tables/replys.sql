create table replys(
  id serial primary key,
  creator integer not null references users(id),
  body text not null,
  segment_id integer not null references segments(id)
);