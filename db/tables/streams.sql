create table streams(
  id serial primary key,
  project_id integer not null references projects(id),
  sort_order integer default null,
  last_edit timestamp null,
  name varchar(255)
);