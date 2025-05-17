$( function()
{
	let allWordInfos;

	$( "#dataFile" ).change( function()
	{
		let dataFile = $( this )[ 0 ].files[ 0 ];
		var reader = new FileReader();
		reader.readAsText( dataFile );
		reader.onload = function()
		{
			let dataName = JSON.parse( reader.result )[ "dataName" ];
			if( dataName === undefined )
			{
				dataName = "タイトル";
			}
			$( "#dataName" ).text( "＜" + dataName + "＞" );
			
			allWordInfos = JSON.parse( reader.result )[ "wordInfos" ];
			let minNo = parseInt( allWordInfos[ 0 ][ "no" ] );
			$( "#minNo" ).text( minNo );

			let maxNo = parseInt( allWordInfos[ allWordInfos.length - 1 ][ "no" ] );
			$( "#maxNo" ).text( maxNo );
		};
	} );

	$( "#showWords" ).click( function()
	{
		let from = $( "#from" ).val();
		if( from === "" )
		{
			from = 1;
		}
		from = parseInt( from );
		if( from <= 0 )
		{
			alert( "開始番号は正の値を指定してください。" );
			return;
		}

		let to = $( "#to" ).val();
		if( to === "" )
		{
			to = allWordInfos.length;
		}
		to = parseInt( to );
		if( to <= 0 )
		{
			alert( "終了番号は正の値を指定してください。" );
			return;
		}

		if( from > to )
		{
			alert( "開始番号(" + from + ")が終了番号(" + to + ")より大きいです。" );
			return;
		}

		initTable();
		function initTable()
		{
			$( "#hideShowAllWord" ).text( "非表示" );
			$( "#hideShowAllSense" ).text( "非表示" );
			$( "#hideShowResult1OK" ).text( "×" );
			$( "#hideShowResult2OK" ).text( "×" );
			$( "#tableBody" ).empty();
		}

		let wordInfoTable = $( "#tableBody" );
		wordInfoTable.empty();
		let wordInfos = allWordInfos.filter( ( wordInfo ) => from <= wordInfo[ "no" ] && wordInfo[ "no" ] <= to );
		for(let i = 0; i < wordInfos.length; i++)
		{
			let wordInfo = wordInfos[ i ];

			let wordRowTemplate = document.getElementById( "wordRowTemplate" );
			let clone = wordRowTemplate.content.cloneNode( true );

			let noCol = $( clone.querySelector( ".no" ) );
			noCol.text( wordInfo[ "no" ] );

			let word = $( clone.querySelector( ".word" ) );
			word.text( wordInfo[ "word" ] );
			let wordCol = $( clone.querySelector( ".wordCol" ) );
			wordCol.click( function()
			{
				toggleVisibility( $( $( this ).children( ".word" )[ 0 ] ) );
			} );

			let sense = $( clone.querySelector( ".sense" ) );
			sense.text( wordInfo[ "sense" ] );
			let senseCol = $( clone.querySelector( ".senseCol" ) );
			senseCol.click( function()
			{
				toggleVisibility( $( $( this ).children( ".sense" )[ 0 ] ) );
			} );

			function toggleVisibility( element )
			{
				let visibility = element.css( "visibility" );
				if( visibility === "visible" )
				{
					element.css( "visibility", "hidden" );
				}
				else
				{
					element.css( "visibility", "visible" );
				}
			}

			let result1Col = $( clone.querySelector( ".result1Col" ) );
			result1Col.click( function()
			{
				toggleResult( $( this ) );
			} );

			let result2Col = $( clone.querySelector( ".result2Col" ) );
			result2Col.click( function()
			{
				toggleResult( $( this ) );
			} );

			function toggleResult( element )
			{
				let text = element.text();
				if( text === "" )
				{
					element.text( "×" );
				}
				else
				{
					element.text( "" );
				}
			}

			document.getElementById( "tableBody" ).appendChild( clone );
		}
	} );

	$( "#minus10" ).click( function()
	{
		slideRange( -10 );
	} );

	$( "#plus10" ).click( function()
	{
		slideRange( 10 );
	} );

	$( "#minus100" ).click( function()
	{
		slideRange( -100 );
	} );

	$( "#plus100" ).click( function()
	{
		slideRange( 100 );
	} );

	function slideRange( slideNumber )
	{
		let rows = $( "#tableBody" ).find( "tr" );
		if( rows.length == 0)
		{
			console.log( "no rows" );
			return;
		}

		let from = getFrom();
		function getFrom()
		{
			let startRow = $( rows[ 0 ] );
			let noCol = startRow.find( "td.no" )[ 0 ];
			let no = parseInt( $( noCol ).text() );
			return no;
		}

		let to = getTo();
		function getTo()
		{
			let startRow = $( rows[ rows.length - 1 ] );
			let noCol = startRow.find( "td.no" )[ 0 ];
			let no = parseInt( $( noCol ).text() );
			return no;
		}

		from += slideNumber;
		to += slideNumber;
		let lastNo = allWordInfos[ allWordInfos.length - 1 ][ "no" ];
		if( from > lastNo )
		{
			from = lastNo;
		}
		if( to > lastNo )
		{
			to = lastNo;
		}

		let firstNo = allWordInfos[ 0 ][ "no" ];
		if( from < firstNo )
		{
			from = firstNo;
		}
		if( to < firstNo )
		{
			to = firstNo;
		}

		$( "#from" ).val( from );
		$( "#to" ).val( to );
		$( "#showWords" ).click();
	}

	$( "#hideShowAllWord" ).click( function()
	{
		let hideShowAllWordButton = $( this );
		let action = hideShowAllWordButton.text();
		if( action === "非表示" )
		{
			hideShowAllWordButton.text( "表示" );
			$( "#wordInfoTable" ).find( ".Word" ).css( "visibility", "hidden" );
		}
		else
		{
			hideShowAllWordButton.text( "非表示" );
			$( "#wordInfoTable" ).find( ".Word" ).css( "visibility", "visible" );
		}
	} );

	$( "#hideShowAllSense" ).click( function()
	{
		let hideShowAllSenseButton = $( this );
		let action = hideShowAllSenseButton.text();
		if( action === "非表示" )
		{
			hideShowAllSenseButton.text( "表示" );
			$( "#wordInfoTable" ).find( ".sense" ).css( "visibility", "hidden" );
		}
		else
		{
			hideShowAllSenseButton.text( "非表示" );
			$( "#wordInfoTable" ).find( ".sense" ).css( "visibility", "visible" );
		}
	} );

	$( "#hideShowResult1OK" ).click( function()
	{
		hideShowResult( $( this ), "result1Col" );
	} );

	$( "#hideShowResult2OK" ).click( function()
	{
		hideShowResult( $( this ), "result2Col" );
	} );

	function hideShowResult( hideShowResultButton, resultClass )
	{
		let action = hideShowResultButton.text();
		let rows = $( "#wordInfoTable" ).find( ".wordRow" );
		if( action === "×" )
		{
			for( let i = 0; i < rows.length; i++ )
			{
				let row = $( rows[ i ] );
				let result1Col = $( row.find( "." + resultClass )[ 0 ] );
				let result1ColText = result1Col.text();
				if( result1ColText === "" )
				{
					row.hide();
				}
			}
			hideShowResultButton.text( "全" );
		}
		else
		{
			for( let i = 0; i < rows.length; i++ )
			{
				let row = $( rows[ i ] );
				row.show();
			}
			hideShowResultButton.text( "×" );
		}
	}

	$( "#clearResult1" ).click( function()
	{
		clearResult( "result1Col" );
	} );

	$( "#clearResult2" ).click( function()
	{
		clearResult( "result2Col" );
	} );

	function clearResult( resultClass )
	{
		let cols = $( "." + resultClass );
		for( let i = 0; i < cols.length; i++ )
		{
			$( cols[ i ] ).text( "" );
		}
	}

});