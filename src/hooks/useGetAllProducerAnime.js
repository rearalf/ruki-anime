import { useEffect, useState } from 'react';
import { getAllProducerAnime } from '../services/getAllProducerAnime';
import { Objec_Genres } from '../utils/models';
import { filterAnimes } from './useGetSeasonAnime';

export function useGetAllProducerAnime({ id }){
	const [ Loading, setLoading ] = useState(false);
	const [ loadingNextPage, setLoadingNextPage ] = useState(false);
	const [ Page, setPage ] = useState(1);
	const [ Animes, setAnimes ] = useState([]);
	const [ Producer, setProducer ] = useState({
		meta: new Object(Objec_Genres),
	});
	const [ FilterAnime, setFilterAnime ] = useState([]);
	const [ Rated, setRated ] = useState(false);
	const [ Option, setOption ] = useState('All');

	const handleChangeRated = () => setRated(!Rated);

	const handleChangeOption = e => setOption(e.target.value);

	useEffect(
		() => {
			setLoading(true);
			getAllProducerAnime({ id })
				.then(res => {
					setAnimes(res.anime);
					setProducer({
						meta: res.meta,
					});
					setLoading(false);
				})
				.catch(() => {
					setLoading(false);
				});
		},
		[ id ],
	);

	useEffect(
		() => {
			if (Page === 1) return;
			setLoadingNextPage(true);
			getAllProducerAnime({ id, Page })
				.then(res => {
					if (res.anime !== undefined) {
						setAnimes(animes => animes.concat(res.anime));
						setLoadingNextPage(false);
					}
					else {
						setLoadingNextPage(false);
					}
				})
				.catch(() => {
					setLoadingNextPage(false);
				});
		},
		[ Page, id ],
	);

	useEffect(
		() => {
			const animes = filterAnimes({
				seasonAnimes: Animes,
				option: Option,
				rated: Rated,
			});
			setFilterAnime(animes);
		},
		[ Animes, Rated, Option ],
	);

	return {
		Animes: FilterAnime,
		Producer,
		Loading,
		setPage,
		loadingNextPage,
		handleChangeRated,
		handleChangeOption,
		Option,
		Rated,
	};
}
