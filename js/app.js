let allWordInfos;

$( function()
{
	$( "#dataFile" ).change( function()
	{
		let dataFile = $( this )[ 0 ].files[ 0 ];
		var reader = new FileReader();
		reader.readAsText( dataFile );
		reader.onload = function()
		{
			allWordInfos = JSON.parse( reader.result )[ "wordInfos" ];
		};
	} );

	$( "#showWords" ).click( function()
	{
		let from = $( "#from" ).val();
		if( from === "" )
		{
			from = 1;
		}
		if( from <= 0 )
		{
			alert( "開始番号は正の値を指定してください。" );
			return;
		}
//		console.log( "from:" + from );

		let to = $( "#to" ).val();
		if( to === "" )
		{
			to = allWordInfos.length;
		}
		if( to <= 0 )
		{
			alert( "終了番号は正の値を指定してください。" );
			return;
		}
//		console.log( "to:" + to );

		if( from > to )
		{
			alert( "開始番号が終了番号より大きいです。" );
			return;
		}

		let wordInfoTable = $( "#tableBody" );
		wordInfoTable.empty();
		let wordInfos = allWordInfos.filter( ( wordInfo ) => from <= wordInfo[ "no" ] && wordInfo[ "no" ] <= to );
		for(var i = 0; i < wordInfos.length; i++)
		{
			let wordInfo = wordInfos[ i ];
			let row = $( '<tr class="wordRow"></tr>' );

			let noCol = $( "<td>" + wordInfo[ "no" ] + "</td>");
			row.append( noCol );

			let wordCol = $( "<td>" + wordInfo[ "word" ] + "</td>");
			row.append( wordCol );

			let senseCol = $( "<td></td>");
			let sense = $( '<span class="sense">' + wordInfo[ "sense" ] + "</span>" );
			senseCol.click( function()
			{
				let senseElem = $( $( this ).children( ".sense" )[ 0 ] );
				let visibility = senseElem.css( "visibility" );
				if( visibility === "visible" )
				{
					senseElem.css( "visibility", "hidden" );
				}
				else
				{
					senseElem.css( "visibility", "visible" );
				}
			} );
			senseCol.append( sense );
			row.append( senseCol );

			let result1Col = $( '<td class="result1Col"></td>');
			result1Col.click( function()
			{
				toggleResult( $( this ) );
			} );
			row.append( result1Col );

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

			let result2Col = $( '<td class="result2Col"></td>');
			result2Col.click( function()
			{
				toggleResult( $( this ) );
			} );
			row.append( result2Col );

			wordInfoTable.append( row );
		}
	} );

	$( "#hideAllSense" ).click( function()
	{
		let hideAllSenseButton = $( this );
		let action = hideAllSenseButton.text();
		if( action === "非表示" )
		{
			hideAllSenseButton.text( "表示" );
			$( "#wordInfoTable" ).find( ".sense" ).css( "visibility", "hidden" );
		}
		else
		{
			hideAllSenseButton.text( "非表示" );
			$( "#wordInfoTable" ).find( ".sense" ).css( "visibility", "visible" );
		}
	} );

	$( "#hideShowResult1OK" ).click( function()
	{
		hideShowResult( $( this ), "result1Col" );
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

	$( "#hideShowResult2OK" ).click( function()
	{
		hideShowResult( $( this ), "result2Col" );
	} );

	$( "#clearResult1" ).click( function()
	{
		clearResult( "result1Col" );
	} );

	function clearResult( resultClass )
	{
		let cols = $( "." + resultClass );
		for( let i = 0; i < cols.length; i++ )
		{
			$( cols[ i ] ).text( "" );
		}
	}

	$( "#clearResult2" ).click( function()
	{
		clearResult( "result2Col" );
	} );

});