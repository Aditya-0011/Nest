create table news ( 
    id bigint primary key, 
    title text, 
    link text, 
    score int, 
    created_at timestamp
);



create or replace procedure insert_news( p_id bigint, p_title text, p_link text, p_score int, p_created_at bigint) as $$
    declare
        x int;

    begin
        select 1 into x from news where id = p_id;

        if not found then
            insert into news(id, title, link, score, created_at) values(p_id, p_title, p_link, p_score, to_timestamp(p_created_at)::timestamp);
        

            perform pg_notify('news_added', json_build_object(
                'type', 'new',
                'news', json_build_object(
                    'id', p_id,
                    'title', p_title,
                    'link', p_link,
                    'score', p_score,
                    'created_at', to_timestamp(p_created_at)::timestamp 
                )
            )::text );

        end if;

    end;
$$ language plpgsql;